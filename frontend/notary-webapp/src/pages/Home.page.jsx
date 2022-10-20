import { Button } from 'primereact/Button'
import { Link } from 'react-router-dom'
export default () => {
  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <div className="w-7 flex flex-column justify-content-center align-items-center">
        <div className="text-4xl font-bold mb-4">Notary</div>
        <Link to="/create-session">
          <Button label="Create a new evnet" />
        </Link>
      </div>
    </div>
  )
}
