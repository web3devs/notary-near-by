import { Button } from 'primereact'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isConnected, login } = useAuth()
  let from = location.state?.from?.pathname || '/'
  useEffect(() => {
    if (isConnected) {
      navigate(from, { replace: true })
    }
  }, [isConnected])

  const handleSignIn = () => {
    login()
  }
  return (
    <div>
      <Button label="Sign in" onClick={handleSignIn} />
    </div>
  )
}
