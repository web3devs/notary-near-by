import { ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'
import ListItem from '../components/dash/ListItem'
import { getOrders } from '../contracts'

export default () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const o = await getOrders()
      setOrders(o)
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
      <div>Client Dashboard</div>
      <div className="w-full">
        {orders.map((o, idx) => {
          return <ListItem data={o} key={JSON.stringify(o) + idx} />
        })}
      </div>
    </div>
  )
}
