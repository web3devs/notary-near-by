import { ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'primereact'
import ListItem from '../../components/dash/ListItem'
import { useAuth, useOrders } from '../../context'
import { getParticipantAccount } from '../../contracts'

export default () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  const { accountAddress, role } = useAuth()
  const { getByOwner } = useOrders()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const os = await getByOwner(accountAddress)
      setOrders(os)
      const { isParticipant } = getParticipantAccount(accountAddress)
      setIsSigned(isParticipant)
      setIsLoading(false)
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
