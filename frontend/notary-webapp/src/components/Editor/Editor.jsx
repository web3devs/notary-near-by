import { useState, useRef, useEffect } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { ScrollPanel } from 'primereact/scrollpanel';
import { v4 as uuidv4 } from 'uuid';
import {
  useWS,
  useAuth,
} from '../../context';
import './editor.css';
import {
  TextWidget,
  SignatureWidget,
} from './widgets';
import { Flow } from './Flow'
import { Participants } from './Participants'
import { Signatures } from './Signatures'
import { Mint } from './Mint'

const Editor = ({ order, downloadURL, publicKey, signature }) => {
  const [body, setBody] = useState('');
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [editorSize, setEditorSize] = useState({
    width: 100,
    height: 100,
  });
  const canvasRef = useRef(null);
  const { pdfDocument, pdfPage } = usePdf({
    file: downloadURL,
    page,
    canvasRef,
  });
  const [ widgets, setWidgets ] = useState([]);
  const [ status, setStatus ] = useState(null);
  const [participantsJoined, setParticipantsJoined] = useState([]);
  const toast = useRef(null);
  const {
    ws,
    msgs,
    join,
    ping,
    sendMessage,
  } = useWS();
  const {
    role,
  } = useAuth();

  useEffect(() => {
    if (order) {
      const o = { ...order };
      setWidgets([ ...o.widgets ]);
      setStatus({ ...o }.status);
      setParticipantsJoined({ ...o }.participants_joined);
    }
  }, [order]);

  useEffect(() => {
    if (!role) {
      toastError('Missing ROLE!') //TODO: Redirect
    }
  }, [role]);

  useEffect(() => {
    ; (async () => {
      if (ws) {
        await join(order.id, publicKey, signature, role);
        // await ping(order.id); //XXX: why were we pinging in here?
      }
    })()
  }, [ws]);

  useEffect(() => {
    if (ws) {
      ws.addEventListener('message', (evt) => {
        if (evt.data !== '') {
          const a = JSON.parse(evt.data);
          if (a.action === 'update-order') {
            setWidgets([...a.data.widgets]);
            setStatus({ ...a.data }.status);
            setParticipantsJoined({ ...a.data }.participants_joined);
          }
        }
      });

      setInterval(() => {
        ping(order.id);
      }, 60 * 1000)
    }
  }, [ws]);


  useEffect(() => {
    if (pdfPage) {
      setEditorSize({ width: pdfPage._pageInfo.view[2], height: pdfPage._pageInfo.view[3] });
      setLoaded(true);
    }
  }, [pdfPage]);

  const upsertWidget = async (widget) => {
    console.log('UPSERT');
    const aw = [...widgets];
    const w = aw.filter(w => w.id === widget.id);
    const wdgts = aw.filter(w => w.id !== widget.id);

    if (w.length === 1) { //update existing widget
      wdgts.push(widget);
      await ws.send(
        JSON.stringify({
          order_id: order.id,
          action: "update-widget",
          data: {
            data: widget,
          },
        })
      );
      setWidgets(wdgts);
      return;
    }

    //add new widget
    aw.push(widget);
    await ws.send(
      JSON.stringify({
        order_id: order.id,
        action: "add-widget",
        data: {
          data: widget,
        },
      })
    );
    setWidgets(aw);
  }

  const deleteWidget = async (widget) => {
    console.log('DELETE');
    const wdgts = [...widgets].filter(w => w.id !== widget.id);
    await ws.send(
      JSON.stringify({
        order_id: order.id,
        action: "remove-widget",
        data: {
          data: widget,
        },
      })
    );
    setWidgets(wdgts);
  }

  const renderWidget = (widget) => {
    if (widget.page !== page) {
      return;
    }

    switch (widget.type) {
      case 'text':
        return <TextWidget order={order} disabled={role !== 'notary'} key={`widget-${widget.type}-${widget.id}`} widget={widget} updateWidget={upsertWidget} deleteWidget={deleteWidget} />
      case 'signature':
        return <SignatureWidget status={status} participantsJoined={participantsJoined} disabled={role !== 'notary'} key={`widget-${widget.type}-${widget.id}`} widget={widget} updateWidget={upsertWidget} deleteWidget={deleteWidget} />
      default:
        break;
    }
  };

  const addTextWidget = () => {
    upsertWidget({
      id: uuidv4(),
      type: 'text',
      page: page,
      value: '',
      x: 0,
      y: 0,
      w: 250,
      h: 15,
    })
  };

  const addSignatureWidget = () => {
    console.log('add signature')
    upsertWidget({
      id: uuidv4(),
      type: 'signature',
      page: page,
      value: '',
      x: 0,
      y: 0,
      w: 250,
      h: 15,
    })
  };

  const todoWidget = (widget) => {
    toast.current.show({ severity: 'warn', summary: 'TODO', detail: `${widget} widget`, life: 3000 })
  }

  const toastError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 3000 })
  }

  return (
    <div className="grid">
      <div className="col-12">
        ROLE: {role}<br />
        Status: {status}<br />
        DownloadURL: <input type="text" value={downloadURL} />
      </div>

      <Toast ref={toast} />
      <div className="col-2">
        {
          role === 'notary' && (
            <Flow orderID={order.id} />
          )
        }

        { role === 'notary' && (
          <Menu model={[
            {
              label: 'Editor',
              items: [
                {label: 'Text', icon: 'pi pi-book', command: addTextWidget},
                {label: 'Date', icon: 'pi pi-calendar', command: () => todoWidget('Date')},
                {label: 'Signature', icon: 'pi pi-pencil', command: addSignatureWidget},
                {label: 'Notary Seal', icon: 'pi pi-check-square', command: () => todoWidget('Notary Seal')},
              ]
            },
          ]} />
        )}

        {order && (
          <Signatures publicKey={publicKey} widgets={widgets} setPage={setPage} />
        )}
      </div>
      <div className="col-8">
        {(!pdfDocument || !loaded) && <ProgressSpinner />}
        <>
          <div id="editor" style={{ width: editorSize.width, height: editorSize.height }}>
            <div id="overlay">
              { widgets.map(w => renderWidget(w)) }
            </div>
            <canvas id="pdfviewer" ref={canvasRef} />
          </div>
        </>

        {Boolean(pdfDocument && pdfDocument.numPages) && (
          <div className="p-buttonset">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}  label="Previous" icon="pi pi-check" />
            <Button disabled={page === pdfDocument.numPages} onClick={() => setPage(page + 1)}  label="Next" icon="pi pi-trash" />
          </div>
        )}

        <div>
          <ScrollPanel style={{ width: '100%', height: '200px' }}>
            <ul>
              {
                [...msgs].map((m, idx) => m[0] === '>' ? <li key={`msg-${idx}`}>{`${m}`}</li> : <li key={`msg-${idx}`}>{`< ${m}`}</li>)
              }
            </ul>
          </ScrollPanel>
          <strong>Message:</strong><br />
          <textarea onChange={e => setBody(e.target.value)} defaultValue={body} /><br />
          <button onClick={async () => await sendMessage(order.id, body)}>send</button>
        </div>

        {widgets.length > 0 && (
          <Panel header="Widgets JSON" toggleable collapsed={true}>
            <pre>{JSON.stringify(widgets, ' ', '  ')}</pre>
          </Panel>
        )}
      </div>

      { order && (
        <div className="col-2">
          <Participants {...order} />
        </div>
      )}

      {
        order && (
          <Mint status={status} />
        )
      }
    </div>
  )};

export default Editor;