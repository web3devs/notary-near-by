import { Button } from 'primereact'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FileUpload from '../../components/FileUpload'
import { signMessage } from '../../contracts'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [file, setFile] = useState(null)
  useEffect(() => {
    ;(async () => {
      console.log(result)
    })()
  }, [])
  return (
    <div>
      <h1>Create order</h1>
      <FileUpload onFileChange={setFile} disabled={isSubmiting} />
      <Link to="/participant">
        <Button label="Create order" />
      </Link>
    </div>
  )
}
