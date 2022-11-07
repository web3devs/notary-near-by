import { useEffect, useState } from 'react'
// import { Button, Dialog, ProgressSpinner } from 'primereact'
// import Mint from '../../components/order-participant/Mint'
import Editor from '../../components/Editor/Editor';
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context'
import { getOrder } from '../../api';

export default () => {
  const [order, setOrder] = useState(undefined);
  const [downloadURL, setDownloadURL] = useState(undefined);
  const { accountAddress } = useAuth()
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

  return (
    <div>
      <h1>Notarial ceremony</h1>
      <div className="flex flex-column justify-content-center align-items-center mt-4">
        {!order && ('Loading....')}
        {order && (
          <Editor order={order} downloadURL={downloadURL} publicKey={accountAddress} signature={'TODO'} />
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
