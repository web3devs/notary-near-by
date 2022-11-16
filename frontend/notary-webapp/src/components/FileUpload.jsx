import { useRef, useState } from 'react'
import { Button, Tooltip } from 'primereact'

export default ({
  label = 'Upload',
  accept = '.jpg,.jpeg,.png,.pdf',
  disabled,
  onFileChange,
  error,
  helper
}) => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  return (
    <div className="flex flex-column align-items-start flex-start gap-2 mb-2">
      <div className="flex flex-row align-items-center gap-2">
        <Button
          disabled={disabled}
          onClick={() => {
            fileInputRef?.current?.click()
          }}
          label={file ? file.name : label}
          icon="pi pi-upload"
          iconPos="right"
        />
        {helper && (<Button icon="pi pi-info" className="p-button-rounded p-button-blue-500 text-white p-button-sm" style={{ height: '1.5rem', width: '1.5rem' }} aria-label="Submit" tooltip={helper} />)}
      </div>
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
