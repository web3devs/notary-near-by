import { ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/Button'
import ListItem from '../../components/dash/ListItem'
import { useAuth } from '../../context/AuthProvider'
import { getParticipantAccount, getOrders } from '../../contracts'

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
      <h1>Participant Dashboard</h1>
      <div className="w-full">
        {isSigned ? (
          <>
            {orders.map((o, idx) => {
              return <ListItem data={o} key={JSON.stringify(o) + idx} />
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
