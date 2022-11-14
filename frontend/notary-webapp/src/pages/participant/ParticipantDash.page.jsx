import { ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'primereact'
import ListItem from '../../components/dash/ListItem'
import { useAuth } from '../../context'
import { getParticipantProfile, getOwnersOrders } from '../../api'
import { Card } from 'primereact/card';
import NoOrdersImage from '../../assets/no-orders.svg'

const  NoOrders = () => {
  const navigate = useNavigate()

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
            {orders.length === 0 && (
              <NoOrders />
            )}

            {orders.map((o, idx) => {
              return (
                <ListItem
                  data={o}
                  key={o.id}
                  onClick={() => {
                    navigate('/orders/' + o.id)
                  }}
                />
              )
            })}
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
