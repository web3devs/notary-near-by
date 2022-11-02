import { ProgressSpinner } from 'primereact'
import { Button } from 'primereact'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ListItem from '../../components/dash/ListItem'
import { useAuth, useOrders } from '../../context'
import { getNotaryAccount } from '../../contracts'

export default () => {
  const { accountAddress, role } = useAuth()
  const { getAll } = useOrders()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const o = await getAll()
      console.log('ORDERS: ', o)
      setOrders(o)
      const { isNotary } = getNotaryAccount(accountAddress)
      setIsSigned(isNotary)
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
    <div className="flex flex-column justify-content-center align-items-center">
      <h1>Notary Dashboard</h1>

      {isSigned ? (
        <>
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
          <div className="mb-4">You are not registered as a notary yet.</div>
          <Link to="/notary/sign-up">
            <Button label="Sign up " />
          </Link>
        </>
      )}
    </div>
  )
}
