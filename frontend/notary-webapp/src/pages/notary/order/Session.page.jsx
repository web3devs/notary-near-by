import { useEffect, useState } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Editor from '../../../components/Editor/Editor';
import { useParams, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context'
import { getOrder } from '../../../api';
import { JitsiMeeting } from '@jitsi/react-sdk';

export default () => {
  const [debug, setDebug] = useState(false)
  const [m, setM] = useState(null);
  const [order, setOrder] = useState(undefined);
  const [downloadURL, setDownloadURL] = useState(undefined);
  const { accountAddress, me, getRole } = useAuth()
  const role = getRole(useLocation)
  const pms = useParams();

  useEffect(() => {
    ; (async () => {
      if (pms) {
        const { order, download_url } = await getOrder(pms.id);
        setOrder(() => ({ ...order }));
        setDownloadURL(download_url);
      }
    })()
  }, [pms]);

  useEffect(() => {
    if (order) {
      setM(me({...order}))
    }
  }, [order])

  return (
    <div className="flex flex-column align-items justify-content-center">
      <div className="flex justify-content-between">
        <h1 className="flex align-items-center justify-content-center">Notarial Ceremony</h1>

        <span className="flex align-items-center justify-content-center">
          <Button label={`Debug ${debug ? 'OFF' : 'ON'}`} onClick={() => setDebug(!debug)} className="p-button-warning text-white" />
        </span>
      </div>

      {
        debug && order && (
          <>
            <div className="text-color">
              Role: {role}<br />
              Status: {order.status}<br />
              Profile: <pre>{JSON.stringify(m)}</pre>
            </div>
            <Panel header="Widgets JSON" toggleable collapsed={true}>
              <pre>{JSON.stringify(order.widgets, ' ', '  ')}</pre>
            </Panel>
          </>
        )
      }

      <Card className="bg-white">
        {!order && (
          <div className="flex flex-column align-items align-items-center justify-content-center mt-8 mb-8">
            <ProgressSpinner />
          </div>
        )}

        {order && (
          <div className="flex flex-column align-items-center">
            {(m && m.full_name) && (
              <JitsiMeeting
                roomName={order.id}
                userInfo={{
                  displayName: `${m.full_name}`
                }}
                getIFrameRef={node => {
                  node.style.width = '100%'
                  node.style.height = '600px'
                }}
                configOverwrite={{
                  prejoinPageEnabled: false
                }}
              />
            )}
            <Editor order={order} setOrder={setOrder} downloadURL={downloadURL} publicKey={accountAddress} signature={'TODO'} />
          </div>
        )}
      </Card>
    </div>
  )
}
