import { ProgressSpinner } from 'primereact'
import { Button } from 'primereact'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllOrders, getNotaryProfile } from '../../api'
import { useAuth } from '../../context'
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import NoOrdersImage from '../../assets/no-orders.svg'
import { StatusNew, StatusDocumentSigned, StatusStarted, StatusFinished, StatusCanceled } from '../../order';
import { ipfsURL } from '../../utils/ipfs'
import { createNotarizedDocument } from '../../contracts/index'

const NoOrders = ({ orders }) => {
  if (orders && orders.length > 0) return

  return (
    <div className="flex flex-column align-items align-items-center justify-content-center mt-8 mb-8">
      <div>
        <img src={NoOrdersImage} alt="No Orders" />
      </div>
      <div className="text-color font-bold mt-3">
        There are no Orders
      </div>
      <div className="text-500 mt-3">
        Open browser in a new window and register as Participant, create order then refresh this page!
      </div>
    </div>
  )
}

const List = ({ orders, publicKey }) => {
  const navigate = useNavigate()

  const join = (o) => navigate('/notary/orders/' + o.id)
  const confirmSigning = async (o) => {
    const tx = await createNotarizedDocument({
      authorizedMinter: o.owner,
      price: 30, //?????
      metadataURI: ipfsURL(o.cid)
    })

    console.log('TX: ', tx)
  }

  if (!orders || orders.length === 0) return

  return (
    <div>
      {
        orders.map((o, idx) => {
          const lastItem = orders.length === idx + 1 ? '' : 'border-bottom-1 border-600 mb-4 pb-4';

          return (
            <div key={`order-${o.id}`} className={`text-color flex align-items-center justify-content-between ${lastItem}`}>
              <div className="flex align-items-center">
                <i className="pi pi-file ml-4 mr-4" />
                <div>
                  <h3>
                    {o.document_type}
                  </h3>
                  <div className="text-500">
                    Order ID: {o.id}
                  </div>
                </div>
              </div>
              <div className="flex flex-column">
                <div className="flex gap-2 mb-2">
                  <Chip label={o.status} className="bg-yellow-500 text-white" />
                  {o.status === StatusNew && o.owner !== publicKey && (o.notary === '' || o.notary === publicKey) && (<Button label="Join" onClick={() => join(o)} tooltipOptions={{ position: 'bottom' }} tooltip="Join Ceremony" />)}
                  {o.status === StatusDocumentSigned && o.notary === publicKey && (<Button label="Confirm signing" onClick={() => confirmSigning(o)} tooltipOptions={{ position: 'bottom' }} tooltip="Calls contract:createNotarizedDocument" />)}
                  {/* <Button label="Foo" className="p-button-secondary" tooltipOptions={{ position: 'bottom' }} tooltip="Something" />
                  <Button label="Foo" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip="Something else" /> */}
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default () => {
  const { accountAddress, publicKey } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(() => true)
        const notary = await getNotaryProfile(accountAddress)
        if (notary) {
          setIsSigned(() => true)
          const o = await getAllOrders()
          setOrders(o)
        } else {
          setIsSigned(() => false)
        }
      } catch (e) {
        console.error(e)
        if (e.response.status === 404) {
          setIsSigned(() => false)
        }
      } finally {
        setIsLoading(() => false)
      }
    })()
  }, [accountAddress])

  useEffect(() => {
    const f = async () => {
      const o = await getAllOrders()
      setOrders(() => o)
    }
    const i = setInterval(() => {
      f()
    }, 1000)
    return () => clearInterval(i)
  }, [])

  if (!isSigned && !isLoading) return navigate('/notary/sign-up')

  return (
    <div className="flex flex-column align-items justify-content-center">
      <div className="flex justify-content-between">
        <h1 className="flex align-items-center justify-content-center">Notary Orders</h1>
      </div>

      <Card className="bg-white">
        {isLoading && (
          <div className="flex flex-column align-items align-items-center justify-content-center mt-8 mb-8">
            <ProgressSpinner />
          </div>
        )}

        {(isSigned && !isLoading) && (
          <>
            <NoOrders orders={orders} />
            <List orders={orders} publicKey={publicKey} />
          </>
        )}

        {/* {(!isSigned && !isLoading) && (
          <>
            <div className="mb-4">
              You are not registered as a Notary yet.
            </div>
            <Link to="/notary/sign-up">
              <Button label="Sign up " />
            </Link>
          </>
        )} */}
      </Card>
    </div>
  )
}
