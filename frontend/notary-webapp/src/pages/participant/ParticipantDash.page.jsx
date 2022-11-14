import { useEffect, useState } from 'react'
import { ProgressSpinner } from 'primereact'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'primereact'
import { useAuth } from '../../context'
import { getParticipantProfile, getOwnersOrders } from '../../api'
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import NoOrdersImage from '../../assets/no-orders.svg'

const  NoOrders = ({ orders }) => {
  const navigate = useNavigate()

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
        Lets create your first order!
      </div>
      <div className="mt-3">
        <Button label="Create Order" onClick={() => navigate('/participant/create-order')} />
      </div>
    </div>
  )
}

const List = ({ orders }) => {
  const navigate = useNavigate()

  const join = (o) => navigate('/orders/' + o.id)

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
                  <Button label="Join" onClick={() => join(o)} />
                  <Button label="Foo" className="p-button-secondary" />
                  <Button label="Foo" className="p-button-danger" />
                </div>
                <div className="flex justify-content-center">
                  <Chip label={o.status} className="bg-primary text-white" />
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
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  const { accountAddress, role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        await getParticipantProfile(accountAddress)
        const os = await getOwnersOrders(accountAddress)
        setOrders(os)
        setIsSigned(true)
      } catch (e) {
        console.log(e)
        if (e.response.status === 404) {
          setIsSigned(false)
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <div className="flex flex-column align-items justify-content-center">
      <div className="flex justify-content-between">
        <h1 className="flex align-items-center justify-content-center">Participant Orders</h1>

        { isSigned && (
          <span className="flex align-items-center justify-content-center">
            <Button label="Create Order" onClick={() => navigate('/participant/create-order')} />
          </span>
        )}

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
            <List orders={orders} />
          </>
        )}

        {(!isSigned && !isLoading) && (
          <>
            <div className="mb-4">
              You are not registered as a Participant yet.
            </div>
            <Link to="/participant/sign-up">
              <Button label="Sign up " />
            </Link>
          </>
        )}
      </Card>
    </div>
  )
}
