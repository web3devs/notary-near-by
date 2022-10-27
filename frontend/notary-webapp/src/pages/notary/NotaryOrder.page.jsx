import { Button } from 'primereact'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div>
      <h1>Notary order</h1>
      <Link to="/notary">
        <Button label="End order" />
      </Link>
    </div>
  )
}
