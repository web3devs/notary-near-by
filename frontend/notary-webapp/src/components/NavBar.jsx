import { Button } from 'primereact'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default ({ className }) => {
  const { logout } = useAuth()
  return (
    <div
      className={`flex flex-row justify-content-between align-items-center ${className}`}
    >
      <div>
        <Link to="/">Notary</Link>
      </div>
      <div>
        <Button
          className="p-button-outlined"
          label="Disconnect"
          onClick={() => {
            logout()
          }}
        />
      </div>
    </div>
  )
}
