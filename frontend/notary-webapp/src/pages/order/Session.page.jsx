import { useEffect, useState } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
// import Mint from '../../components/order-participant/Mint'
import { Card } from 'primereact/card';
import Editor from '../../components/Editor/Editor';
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context'
import { getOrder } from '../../api';
import { JitsiMeeting } from '@jitsi/react-sdk';

export default () => {
  const [m, setM] = useState(null);
  const [order, setOrder] = useState(undefined);
  const [downloadURL, setDownloadURL] = useState(undefined);
  const { accountAddress, me } = useAuth()
  const pms = useParams();

  useEffect(() => {
    ; (async () => {
      if (pms) {
        const { order, download_url } = await getOrder(pms.id);
        setOrder({ ...order });
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
      </div>
      <Card className="bg-white">
        {!order && (
          <div className="flex flex-column align-items align-items-center justify-content-center mt-8 mb-8">
            <ProgressSpinner />
          </div>
        )}

        {order && (
          <div className="flex flex-column align-items-center">
            {m && (
              <JitsiMeeting
                roomName={order.id}
                userInfo={{
                  displayName: `${m.first_name} ${m.last_name}`
                }}
                getIFrameRef={node => {
                  node.style.width = '100%'
                  node.style.height = '600px'
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
