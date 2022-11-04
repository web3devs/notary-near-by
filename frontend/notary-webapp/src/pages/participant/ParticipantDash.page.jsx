import { ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'primereact'
import ListItem from '../../components/dash/ListItem'
import { useAuth } from '../../context'
import { getParticipantProfile, getOwnersOrders } from '../../api'

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

  if (isLoading) {
    return (
      <div className="flex align-items-center justify-content-center">
        <ProgressSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-column align-items justify-content-center">
      <h1>Participants orders</h1>
      <div className="w-full">
        {isSigned ? (
          <>
            <Link to="/participant/create-order">
              <Button label="Create order" className="mb-4" />
            </Link>
            {orders.length === 0 && (
              <div className="p-4 text-center">There are no orders</div>
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
        ) : (
          <>
            <div className="mb-4">
              You are not registered as a Participant yet.
            </div>
            <Link to="/participant/sign-up">
              <Button label="Sign up " />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
