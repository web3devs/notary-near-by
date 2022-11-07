import { useRef, useState } from 'react'
import { Button } from 'primereact'

export default ({
  label = 'Upload',
  accept = '.jpg,.jpeg,.png,.pdf',
  disabled,
  onFileChange,
  error
}) => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  return (
    <div className="flex flex-column align-items-start flex-start gap-2 mb-2">
      <Button
        disabled={disabled}
        onClick={() => {
          fileInputRef?.current?.click()
        }}
        label={file ? file.name : label}
        icon="pi pi-upload"
        iconPos="right"
      />
      {error && <div className="p-error">{error}</div>}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          setFile(e.target.files[0])
          onFileChange(e.target.files)
        }}
        style={{ display: 'none' }}
        accept={accept}
      />
    </div>
  )
}
