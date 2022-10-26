import { useState } from 'react'
import FileUpload from '../../components/FileUpload'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [file, setFile] = useState(null)
  return (
    <div>
      <h1>Create session</h1>
      <FileUpload onFileChange={setFile} disabled={isSubmiting} />
      <Button label="Create session" />
    </div>
  )
}
