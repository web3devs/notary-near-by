import { Button } from 'primereact'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo-alt.svg'
import { useAuth } from '../context/AuthProvider'

export default ({ className }) => {
  const { logout } = useAuth()
  return (
    <div
      className={`flex flex-row justify-content-between align-items-center ${className} bg-primary`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '1em 2em',
      }}
    >
      <div>
        <Link to="/"><img src={Logo} alt="Homepage" /></Link>
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
