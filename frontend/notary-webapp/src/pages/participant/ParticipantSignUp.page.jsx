import { InputText } from 'primereact'
import { Button } from 'primereact/Button'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpParticipant } from '../../contracts'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: ''
  })
  const [ID, setID] = useState(null)
  const idFileUploadRef = useRef()
  const navigate = useNavigate()

  const handleSubmit = useCallback(async () => {
    setIsSubmiting(true)
    await signUpParticipant(form, ID)
    setIsSubmiting(false)
    navigate('/participant')
  }, [form, ID])

  return (
    <div>
      <h1>Sign up as a Participant</h1>
      <span className="p-float-label mb-2">
        <InputText
          id="firstName"
          disabled={isSubmiting}
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <label htmlFor="firstName">First name</label>
      </span>
      <span className="p-float-label mb-2">
        <InputText
          id="lastName"
          disabled={isSubmiting}
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <label htmlFor="lastName">Last name</label>
      </span>
      <div className="flex flex-start gap-2 mb-2">
        <Button
          disabled={isSubmiting}
          onClick={() => {
            idFileUploadRef?.current?.click()
          }}
          className="p-button-outlined"
        >
          ID / Passport
        </Button>
        <input
          type="file"
          ref={idFileUploadRef}
          onChange={(e) => setID(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      <Button label="Sign up" loading={isSubmiting} onClick={handleSubmit} />
    </div>
  )
}
