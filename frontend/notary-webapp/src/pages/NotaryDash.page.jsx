import { Button } from 'primereact/Button'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div className="flex flex-column justify-content-center align-items-center">
      <h1>Notary Dashboard</h1>
      <div className="mb-4">You are not registered as a notary yet.</div>
      <Link to="/notary/sign-up">
        <Button label="Sign up " />
      </Link>
    </div>
  )
}
