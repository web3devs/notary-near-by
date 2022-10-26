import { ProgressSpinner } from 'primereact'
import { Button } from 'primereact/Button'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { getNotaryAccount, getOrders } from '../../contracts'

export default () => {
  const { accountAddress } = useAuth()

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const o = await getOrders()
      setOrders(o)
      const { isParticipant } = getNotaryAccount(accountAddress)
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
                  navigator('/notary/session/' + o.id)
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
