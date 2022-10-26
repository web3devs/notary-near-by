import { useRef } from 'react'

export default ({ disabled, onFileChange }) => {
  const fileInputRef = useRef(null)
  return (
    <div className="flex flex-start gap-2 mb-2">
      <Button
        disabled={disabled}
        onClick={() => {
          fileInputRef?.current?.click()
        }}
        className="p-button-outlined"
      >
        Stamp
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileChange(e.target.files)}
        style={{ display: 'none' }}
      />
    </div>
  )
}
