import { useState, useRef, useEffect } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Menu } from 'primereact/menu';
import { v4 as uuidv4 } from 'uuid';
import {
  useWS,
  useAuth,
} from '../../context';
import './editor.css';
import {
  TextWidget,
  DateWidget,
  SignatureWidget,
  NotarySignatureWidget,
  NotaryStampWidget,
} from './widgets';
import { Flow } from './Flow'
import { Participants } from './Participants'
import { Signatures } from './Signatures'
import { Mint } from './Mint'
import { ParticipantFeedback } from './ParticipantFeedback'
import { Dialog } from 'primereact/dialog';
import { useNavigate, useLocation } from 'react-router-dom'

const Editor = ({ order, setOrder, downloadURL, publicKey, signature }) => {
  const [missingRoleDialog, setMissingRoleDialog] = useState(false)
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
  const [notary, setNotary] = useState({full_name: ''})
  const {
    ws,
    join,
    ping,
  } = useWS();
  const {
    getRole,
  } = useAuth();
  const navigate = useNavigate();
  const role = getRole(useLocation);

  useEffect(() => {
    if (order) {
      const o = { ...order };
      setWidgets([ ...o.widgets ]);
      setStatus({ ...o }.status);
      setParticipantsJoined({ ...o }.participants_joined);
      setNotary({ ...o }.notary_joined);
    }
  }, [order]);

  useEffect(() => {
    if (!role) {
      setMissingRoleDialog(true)
    }
  }, [role]);

  useEffect(() => {
    ; (async () => {
      if (ws) {
        await join(order.id, publicKey, signature, role);
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
            setNotary({ ...a.data }.notary_joined);
            setOrder({ ...a.data })
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
      case 'date':
        return <DateWidget order={order} disabled={role !== 'notary'} key={`widget-${widget.type}-${widget.id}`} widget={widget} updateWidget={upsertWidget} deleteWidget={deleteWidget} />
      case 'signature':
        return <SignatureWidget status={status} participantsJoined={participantsJoined} disabled={role !== 'notary'} key={`widget-${widget.type}-${widget.id}`} widget={widget} updateWidget={upsertWidget} deleteWidget={deleteWidget} />
      case 'notary-signature':
        return <NotarySignatureWidget status={status} participantsJoined={participantsJoined} disabled={role !== 'notary'} key={`widget-${widget.type}-${widget.id}`} widget={widget} updateWidget={upsertWidget} deleteWidget={deleteWidget} />
      case 'notary-stamp':
        return <NotaryStampWidget status={status} participantsJoined={participantsJoined} disabled={role !== 'notary'} key={`widget-${widget.type}-${widget.id}`} widget={widget} updateWidget={upsertWidget} deleteWidget={deleteWidget} />
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

  const addDateWidget = () => {
    upsertWidget({
      id: uuidv4(),
      type: 'date',
      page: page,
      value: '',
      x: 0,
      y: 0,
      w: 250,
      h: 15,
    })
  };

  const addSignatureWidget = () => {
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

  const addNotarySignatureWidget = () => {
    upsertWidget({
      id: uuidv4(),
      type: 'notary-signature',
      page: page,
      value: notary,
      x: 0,
      y: 0,
      w: 250,
      h: 15,
    })
  };

  const addNotaryStampWidget = () => {
    upsertWidget({
      id: uuidv4(),
      type: 'notary-stamp',
      page: page,
      value: notary,
      x: 0,
      y: 0,
      w: 250,
      h: 15,
    })
  };

  return (
    <div className="grid w-full mt-4">
      <Dialog header="Missing role!" visible={missingRoleDialog} style={{ width: '50vw' }} footer={<Button label="Take me to role selection" icon="pi pi-chevron-right" iconPos="right" onClick={() => navigate('/')} autoFocus />} closable={false} resizable={false} draggable={false}>
        <p>You don't have a role selected. You've probably refreshed the page - please don't do that again.</p>
      </Dialog>

      <div className="col-2">
        {
          role === 'notary' && (
            <Flow orderID={order.id} state={status} />
          )
        }

        { role === 'notary' && (
          <Menu model={[
            {
              label: 'Editor',
              items: [
                {label: 'Text', icon: 'pi pi-book', command: addTextWidget},
                {label: 'Date', icon: 'pi pi-calendar', command: addDateWidget },
                {label: 'Signature', icon: 'pi pi-pencil', command: addSignatureWidget},
                { label: 'Notary Signature', icon: 'pi pi-check-square', command: addNotarySignatureWidget },
                {label: 'Notary Stamp', icon: 'pi pi-verified', command: addNotaryStampWidget},
              ]
            },
          ]} className="w-full" />
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
          <div className="flex justify-content-center flex-wrap gap-2 mt-3" style={{ width: editorSize.width }}>
            <Button className="flex align-items-center justify-content-center" disabled={page === 1} onClick={() => setPage(page - 1)} label="Previous" icon="pi pi-chevron-left" iconPos="left" />
            <Button className="flex align-items-center justify-content-center p-button-round" disabled={true} label={page} />
            <Button className="flex align-items-center justify-content-center" disabled={page === pdfDocument.numPages} onClick={() => setPage(page + 1)} label="Next" icon="pi pi-chevron-right" iconPos="right" />
          </div>
        )}
      </div>

      { order && (
        <div className="col-2">
          <Participants {...order} participants_joined={participantsJoined} />
        </div>
      )}

      {
        role === 'notary' && (
          <Mint status={status} order={order} />
        )
      }

      {
        role === 'participant' && (
          <ParticipantFeedback status={status} order={order} />
        )
      }
    </div>
  )};

export default Editor;