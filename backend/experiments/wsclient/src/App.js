import { useState, useEffect, useRef } from 'react';
import { Panel } from 'primereact/panel';
import Editor from './Editor/Editor.js';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';

function App() {
  const [ ws, setWS ] = useState(null);
  const [ body, setBody ] = useState(undefined);
  const [ msgs, setMsgs ] = useState([]);
  const [ orderID, setOrderID ] = useState(undefined);
  const [ joined, setJoined ] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    if (ws === null) {
      const w = new WebSocket('wss://fv7jlocwbk.execute-api.us-east-1.amazonaws.com/dev');
      w.onopen = function () {
        console.log("Connecting...");
        setWS(w);
      };
      w.onclose = function (evt) {
        console.log("I'm sorry. Bye!");
      };
      w.onmessage = function (evt) {
        console.log('evt: ', evt)
        console.log('msg: ', evt.data)
        if (evt.data !== '') {
          setMsgs(msgs => [...msgs, evt.data]);
        }
      };
      w.onerror = function (evt) {
        console.log("ERR: " + evt.data);
        w.close();
      };
      
    }
  }, [ws]);

  const join = async () => {
    ws.send(
      JSON.stringify({
        action: 'join',
        data: {
          order_id: orderID,
          publicKey: 'todo:publicKey',
          signature: 'todo:signature',
        },
      })
    );
    setJoined(true)
  };

  const send = async () => {
    setMsgs([...msgs, `> ${body}`])
    ws.send(
      JSON.stringify({
        action: "message",
        data: {
          order_id: orderID,
          message: body,
        },
      })
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-2">
          <Panel header="Items" toggleable style={{ width: '100%' }}>
            <Menu model={[
              {
                label: 'Widgets',
                items: [
                  {
                    label: 'Text',
                    icon: 'pi pi-book',
                    command: () => {
                      toast.current.show({ severity: 'warn', summary: 'TODO', detail: 'Text widget', life: 3000 });
                    }
                  },
                  {
                    label: 'Date',
                    icon: 'pi pi-calendar',
                    command: () => {
                      toast.current.show({ severity: 'warn', summary: 'TODO', detail: 'Date widget', life: 3000 });
                    }
                  },
                  {
                    label: 'Signature',
                    icon: 'pi pi-pencil',
                    command: () => {
                      toast.current.show({ severity: 'warn', summary: 'TODO', detail: 'Signature widget', life: 3000 });
                    }
                  },
                  {
                    label: 'Notary Seal',
                    icon: 'pi pi-check-square',
                    command: () => {
                      toast.current.show({ severity: 'warn', summary: 'TODO', detail: 'Notary Seal widget', life: 3000 });
                    }
                  },
                ]
              },
            ]} />
          </Panel>
        </div>
        <div className="col-10">
          <Panel header="Editor" toggleable style={{ width: '100%' }}>
            <Editor />
            Sample PDF downloaded from <a href="https://file-examples.com/index.php/sample-documents-download/sample-pdf-download/">https://file-examples.com/index.php/sample-documents-download/sample-pdf-download/</a>
          </Panel>
        </div>
        <div className="col-12">
          <Panel header="Messages" toggleable style={{ width: '100%'}}>
            <div className="grid">
              <div className="col-12">
                <ul>
                  {
                    [...msgs].map((m, idx) => m[0] === '>' ? <li key={`msg-${idx}`}>{`${m}`}</li> : <li key={`msg-${idx}`}>{`< ${m}`}</li>)
                  }
                </ul>
              </div>
              {!joined && (
                <div className="col-12">
                  <strong>Order:</strong><br />
                  <input type="text" onChange={(e => setOrderID(e.target.value))} />
                  <button onClick={join}>join</button>
                </div>
              )}
              {
                joined && (
                  <div className="col-12">
                    <strong>Message:</strong><br />
                    <textarea onChange={e => setBody(e.target.value)}>{body}</textarea><br />
                    <button onClick={send}>send</button>
                  </div>
                )
              }
            </div>
          </Panel>
          
        </div>
      </div>
    </>
  );
}

export default App;
