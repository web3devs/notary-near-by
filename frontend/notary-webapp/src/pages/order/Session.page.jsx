import { useEffect, useState } from 'react'
import { Button, Dialog, ProgressSpinner } from 'primereact'
import Mint from '../../components/order-participant/Mint'
import Editor from '../../components/Editor/Editor';
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context'

export default () => {
  const [order, setOrder] = useState(undefined);
  const [role, setRole] = useState(undefined);
  // const [isWaiting, setIsWaiting] = useState(false)
  // const [showDialog, setShowDialog] = useState(false)

  const { accountAddress } = useAuth()
  const pms = useParams();

  return (
    <div>
      <h1>Notarial ceremony</h1>
      <div className="flex flex-column justify-content-center align-items-center mt-4">
        <Editor orderID={pms.id} publicKey={accountAddress} signature={'TODO'} />

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
