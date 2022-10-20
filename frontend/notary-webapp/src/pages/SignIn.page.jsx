import { Button } from 'primereact'
import { useEffect } from 'react'
import { useNearUser } from 'react-near'
import { useLocation, useNavigate } from 'react-router-dom'

export default () => {
  const nearUser = useNearUser()
  const navigate = useNavigate()
  const location = useLocation()
  let from = location.state?.from?.pathname || '/'
  useEffect(() => {
    if (nearUser.isConnected) {
      navigate(from, { replace: true })
    }
  }, [nearUser.isConnected])

  const handleSignIn = () => {
    nearUser.connect()
  }
  return (
    <div>
      <Button label="Sign in" onClick={handleSignIn} />
    </div>
  )
}
