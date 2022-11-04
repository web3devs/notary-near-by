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
    console.log(isConnected, from)
    if (isConnected) {
      if (from) {
        navigate(from, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } else {
    }
  }, [isConnected])

  const handleSignIn = () => {
    login()
  }
  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <Button label="Connect wallet" onClick={handleSignIn} />
    </div>
  )
}
