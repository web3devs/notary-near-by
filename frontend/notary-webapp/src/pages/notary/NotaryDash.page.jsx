import { ProgressSpinner } from 'primereact'
import { Button } from 'primereact'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllOrders, getNotaryProfile } from '../../api'
import ListItem from '../../components/dash/ListItem'
import { useAuth, useOrders } from '../../context'
import { getNotaryAccount } from '../../contracts'

export default () => {
  const { accountAddress } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const notary = await getNotaryProfile(accountAddress)
        console.log(notary)
        const o = await getAllOrders()
        console.log('ORDERS: ', o)
        setOrders(o)
        setIsSigned(true)
      } catch (e) {
        if (e.response.status === 404) {
          setIsSigned(false)
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [accountAddress])
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
          <div className="mb-4">You are not registered as a notary yet.</div>
          <Link to="/notary/sign-up">
            <Button label="Sign up " />
          </Link>
        </>
      )}
    </div>
  )
}
