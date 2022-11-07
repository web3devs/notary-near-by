import { FileUpload, InputText } from 'primereact'
import { Button } from 'primereact'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpNotary } from '../../api';
import { useAuth } from '../../context'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [license, setLicense] = useState(null)
  const [stamp, setStamp] = useState(null)
  const licenseFileUploadRef = useRef()
  const stampFileUploadRef = useRef()
  const navigate = useNavigate()
  const { accountAddress, signature } = useAuth()

  const handleSubmit = useCallback(async () => {
    setIsSubmiting(true)
    await signUpNotary(accountAddress, signature, firstName, lastName)
    setIsSubmiting(false)
    navigate('/notary')
  }, [accountAddress, signature, firstName, lastName, license, stamp])

  return (
    <div>
      <h1>Sign up as a Notary</h1>
      <span className="p-float-label mb-2">
        <InputText
          id="firstName"
          disabled={isSubmiting}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="firstName">First name</label>
      </span>

      <span className="p-float-label mb-2">
        <InputText
          id="lastName"
          disabled={isSubmiting}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="lastName">Last name</label>
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
