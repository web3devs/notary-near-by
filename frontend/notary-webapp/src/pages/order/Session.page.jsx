import { useEffect, useState } from 'react'
// import { Button, Dialog, ProgressSpinner } from 'primereact'
// import Mint from '../../components/order-participant/Mint'
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
    <div>
      <h1>Notarial ceremony</h1>
      <div className="flex flex-column justify-content-center align-items-center mt-4">
        {!order && ('Loading....')}
        <pre>{JSON.stringify(m)}</pre>
        {order && (
          <>
            {m && (
              <JitsiMeeting
                roomName={order.id}
                userInfo={{
                  displayName: `${m.first_name} ${m.last_name}`
                }}
                getIFrameRef={node => {
                  node.style.width = '800px'
                  node.style.height = '600px'
                }}
              />
            )}
            <Editor order={order} setOrder={setOrder} downloadURL={downloadURL} publicKey={accountAddress} signature={'TODO'} />
          </>
        )}

        {/* {isWaiting ? (
          <>
            <ProgressSpinner />
            <div>Waiting for Notary</div>
          </>
        ) : (
          <div>Order content</div>
        )} */}
      </div>
      {/* <Dialog visible={showDialog} showHeader={false}>
        <Mint />
      </Dialog> */}
    </div>
  )
}
