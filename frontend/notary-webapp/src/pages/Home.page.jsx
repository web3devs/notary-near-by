import { Button } from 'primereact'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
export default () => {
  const { isConnected, login, setRole } = useAuth()
  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <div className="w-7 flex flex-column justify-content-center align-items-center">
        <div className="text-4xl font-bold mb-4">Notary</div>
        <div className="flex gap-2">
          <Link to="/participant" aria-disabled={!isConnected}>
            <Button
              label="I'm a Participant"
              disabled={!isConnected}
              onClick={() => setRole('participant')}
            />
          </Link>
          <Link to="/notary" aria-disabled={!isConnected}>
            <Button
              label="I'm a Notary"
              disabled={!isConnected}
              onClick={() => setRole('notary')}
            />
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
