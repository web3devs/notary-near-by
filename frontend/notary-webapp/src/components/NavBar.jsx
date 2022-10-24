import { Button } from 'primereact/Button'
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
          label="logout"
          onClick={() => {
            logout()
          }}
        />
      </div>
    </div>
  )
}
