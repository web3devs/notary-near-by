import { useRef, useState } from 'react'
import { Button } from 'primereact'

export default ({ label = 'Upload', accept = '.jpg,.jpeg,.png,.pdf', disabled, onFileChange }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null)

  return (
    <div className="flex flex-start gap-2 mb-2">
      <Button
        disabled={disabled}
        onClick={() => {
          fileInputRef?.current?.click()
        }}
        label={file ? file.name : label}
        icon="pi pi-upload"
        iconPos="right"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          setFile(e.target.files[0]);
          onFileChange(e.target.files);
        }}
        style={{ display: 'none' }}
        accept={accept}
      />
    </div>
  )
}
