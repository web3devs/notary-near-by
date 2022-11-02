import { useState, useRef, useEffect } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { Rnd } from 'react-rnd';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { ScrollPanel } from 'primereact/scrollpanel';
import { v4 as uuidv4 } from 'uuid';
import {
  useWS,
  useAuth,
  useOrders,
} from '../../context';
import './editor.css';

const TextWidget = ({ widget, updateWidget, deleteWidget }) => {
  const [valid, setValid] = useState(true); //TODO
  let { x, y, value } = widget;

  return (
    <Rnd
      size={{ width: 250, height: 15 }}
      enableResizing={false}
      bounds="parent"
      className={`widget widget-text widget-is-valid-${valid} p-overlay-badge`}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      position={{ x, y }}
      onDragStop={(e, d) => {
        if (e.srcElement.className === 'pi pi-trash') {
          return;
        }

        if (e.srcElement.className === 'pi pi-file-edit') {
          return;
        }
        updateWidget({ ...widget, x: d.x, y: d.y})
      }}
    >
      {value}
      <div className="context-menu" onClick={() => {e.preventDefault(); e.stopPropagation();}}>
        <i className="pi pi-file-edit" />
        <i className="pi pi-trash" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteWidget(widget)
        }} />
      </div>
    </Rnd>
  )
}

const Editor = ({ orderID, publicKey, signature }) => {
  const [body, setBody] = useState('');
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [editorSize, setEditorSize] = useState({
    width: 100,
    height: 100,
  });
  const canvasRef = useRef(null);
  const { pdfDocument, pdfPage } = usePdf({
    file: 'http://localhost:5173/sample.pdf',
    page,
    canvasRef,
  });
  const [ widgets, setWidgets ] = useState([]);
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
  const {
    getOne: getOrder
  } = useOrders();

  useEffect(() => {
    if (!role) {
      toastError('Missing ROLE!') //TODO: Redirect
    }
  }, [role]);

  useEffect(() => {
    ; (async () => {
      const o = await getOrder(orderID);
      setWidgets([...o.widgets]);
    })()
  }, []);

  useEffect(() => {
    ; (async () => {
      if (ws) {
        await join(orderID, publicKey, signature, role);
        // await ping(orderID); //XXX: why were we pinging in here?
      }
    })()
  }, [ws]);

  useEffect(() => {
    if (ws) {
      ws.addEventListener('message', (evt) => {
        if (evt.data !== '') {
          const a = JSON.parse(evt.data);
          console.log('MESSAGE BACK: ', a)
          if (a.action === 'update-order') {
            setWidgets([...a.data.widgets]);
          }
        }
      });

      setInterval(() => {
        ping(orderID);
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
          order_id: orderID,
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
        order_id: orderID,
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
        order_id: orderID,
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
        return <TextWidget key={`widget-${widget.type}-${widget.id}`} widget={widget} updateWidget={upsertWidget} deleteWidget={deleteWidget} />
      default:
        break;
    }
  };

  const addTextWidget = () => {
    upsertWidget({
      id: uuidv4(),
      type: 'text',
      page: page,
      value: 'Yadda yadda yadda',
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
      <div className="col-12">ROLE: {role}</div>
      <Toast ref={toast} />
      <div className="col-2">
        { role === 'notary' && (
          <Menu model={[
            {
              label: 'Widgets',
              items: [
                {label: 'Text', icon: 'pi pi-book', command: addTextWidget},
                {label: 'Date', icon: 'pi pi-calendar', command: () => todoWidget('Date')},
                {label: 'Signature', icon: 'pi pi-pencil', command: () => todoWidget('Signature')},
                {label: 'Notary Seal', icon: 'pi pi-check-square', command: () => todoWidget('Notary Seal')},
              ]
            },
          ]} />
        )}
      </div>
      <div className="col-8">
        {(!pdfDocument || !loaded) && <ProgressSpinner />}
        {
          editorSize && (
            <>
              <div id="editor" style={{ width: editorSize.width, height: editorSize.height }}>
                <div id="overlay">
                  { widgets.map(w => renderWidget(w)) }
                </div>
                <canvas id="pdfviewer" ref={canvasRef} />
              </div>
              Sample PDF downloaded from <a href="https://file-examples.com/index.php/sample-documents-download/sample-pdf-download/">https://file-examples.com/index.php/sample-documents-download/sample-pdf-download/</a>
            </>
          )
        }

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
          <textarea onChange={e => setBody(e.target.value)}>{body}</textarea><br />
          <button onClick={async () => await sendMessage(orderID, body)}>send</button>
        </div>

        {widgets.length > 0 && (
          <Panel header="Widgets JSON" toggleable collapsed={true}>
            <pre>{JSON.stringify(widgets, ' ', '  ')}</pre>
          </Panel>
        )}
      </div>

      <div className="col-2">
        TODO: Participants, notary, etc
      </div>
    </div>
  )};

export default Editor;