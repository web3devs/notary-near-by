import { Button } from 'primereact'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { signMessage } from '../contracts'
export default () => {
  const { isConnected, login } = useAuth()

  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <div className="w-7 flex flex-column justify-content-center align-items-center">
        <div className="text-4xl font-bold mb-4">Notary</div>
        <div className="flex gap-2">
          <Link to="/participant" aria-disabled={!isConnected}>
            <Button label="I'm a Participant" disabled={!isConnected} />
          </Link>

          <Link to="/notary" aria-disabled={!isConnected}>
            <Button label="I'm a Notary" disabled={!isConnected} />
          </Link>
        </div>
        {!isConnected && (
          <Button
            label="Connect wallet"
            className="p-button-outlined mt-4"
            onClick={() => {
              login()
            }}
          />
        )}
      </div>
    </div>
  )
}
