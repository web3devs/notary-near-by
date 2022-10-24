import { FileUpload, InputText } from 'primereact'
import { Button } from 'primereact/Button'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpNotary } from '../contracts'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [license, setLicense] = useState(null)
  const [stamp, setStamp] = useState(null)
  const licenseFileUploadRef = useRef()
  const stampFileUploadRef = useRef()
  const navigate = useNavigate()

  const handleSubmit = useCallback(async () => {
    setIsSubmiting(true)
    await signUpNotary(companyName, license, stamp)
    setIsSubmiting(false)
    navigate('/notary')
  }, [companyName, license, stamp])

  return (
    <div>
      <h1>Sign up as a notary</h1>
      <span className="p-float-label mb-2">
        <InputText
          id="companyName"
          disabled={isSubmiting}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <label htmlFor="companyName">Company name</label>
      </span>
      <div className="flex flex-start gap-2 mb-2">
        <Button
          disabled={isSubmiting}
          onClick={() => {
            licenseFileUploadRef?.current?.click()
          }}
          className="p-button-outlined"
        >
          Notary license
        </Button>
        <input
          type="file"
          ref={licenseFileUploadRef}
          onChange={(e) => setLicense(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      <div className="flex flex-start gap-2 mb-2">
        <Button
          disabled={isSubmiting}
          onClick={() => {
            stampFileUploadRef?.current?.click()
          }}
          className="p-button-outlined"
        >
          Stamp
        </Button>
        <input
          type="file"
          ref={stampFileUploadRef}
          onChange={(e) => setStamp(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      <Button label="Sign up" loading={isSubmiting} onClick={handleSubmit} />
    </div>
  )
}
