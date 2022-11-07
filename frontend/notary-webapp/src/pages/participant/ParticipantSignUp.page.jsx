import { InputText } from 'primereact'
import { Button } from 'primereact'
import { useEffect } from 'react'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpParticipant } from '../../api'
import { useAuth } from '../../context'
import useForm from '../../utils'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { accountAddress, signature } = useAuth()
  const { formData, errors, submit, setFormField, canSubmit } = useForm({
    data: {
      firstName: null,
      lastName: null,
      ID: null
    },
    constraints: {
      firstName: {
        presence: {
          notEmpty: true
        }
      },
      lastName: {
        presence: true
      },
      ID: {
        presence: true
      }
    }
  })
  const idFileUploadRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    console.log(errors)
  }, [errors])
  const handleSubmit = useCallback(async () => {
    setIsSubmiting(true)
    await signUpParticipant(
      accountAddress,
      signature,
      formData.firstName,
      formData.lastName
    )
    setIsSubmiting(false)
    navigate('/participant')
  }, [formData])

  return (
    <div>
      <h1>Sign up as a Participant</h1>
      <span className="p-float-label mb-4">
        <InputText
          id="firstName"
          disabled={isSubmiting}
          value={formData.firstName || ''}
          onChange={(e) => setFormField('firstName', e.target.value || null)}
        />
        <label htmlFor="firstName">First name</label>
        {errors?.firstName && (
          <div className="p-error absolute">{errors.firstName}</div>
        )}
      </span>
      <span className="p-float-label mb-4">
        <InputText
          id="lastName"
          disabled={isSubmiting}
          value={formData.lastName || ''}
          onChange={(e) => setFormField('lastName', e.target.value || null)}
        />
        <label htmlFor="lastName">Last name</label>

        {errors?.lastName && (
          <div className="p-error absolute">{errors.lastName}</div>
        )}
      </span>
      <div className="flex flex-start flex-column align-items-start gap-2 mb-4">
        <Button
          disabled={isSubmiting}
          onClick={() => {
            idFileUploadRef?.current?.click()
          }}
          className="p-button-outlined"
        >
          ID / Passport
        </Button>
        {errors?.ID && <div className="p-error">{errors.ID}</div>}
        <input
          type="file"
          ref={idFileUploadRef}
          onChange={(e) => setFormField('ID', e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      <Button
        label="Sign up"
        loading={isSubmiting}
        onClick={(e) => submit(handleSubmit, e)}
        disabled={!canSubmit}
      />
    </div>
  )
}
