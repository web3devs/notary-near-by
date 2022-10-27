import { ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'

export default () => {
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    setIsWaiting(true)
    setTimeout(() => {
      setIsWaiting(false)
    }, 3000)
  }, [])
  return (
    <div>
      <h1>Participant order</h1>
      <div className="flex flex-column justify-content-center align-items-center mt-4">
        {isWaiting ? (
          <>
            <ProgressSpinner />
            <div>Waiting for Notary</div>
          </>
        ) : (
          <div>Order content</div>
        )}
      </div>
    </div>
  )
}
