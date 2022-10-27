import { Button, Dialog, ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'
import Mint from '../../components/order-participant/Mint'

export default () => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  useEffect(() => {
    setIsWaiting(true)
    setTimeout(() => {
      setIsWaiting(false)
    }, 3000)

    setTimeout(() => {
      setShowDialog(true)
    }, 1000)
  }, [])
  return (
    <div>
      <h1>Participant order</h1>
      <div className="flex flex-column justify-content-center align-items-center mt-4">
        {isWaiting ? (
          <>
            <ProgressSpinner />
            <div>Waiting for Notary</div>
          </>
        ) : (
          <div>Order content</div>
        )}
      </div>
      <Dialog visible={showDialog} showHeader={false}>
        <Mint />
      </Dialog>
    </div>
  )
}
