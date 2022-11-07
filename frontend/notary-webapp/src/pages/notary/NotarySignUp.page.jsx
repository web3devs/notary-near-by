import { FileUpload, InputText } from 'primereact'
import { Button } from 'primereact'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpNotary } from '../../api'
import { useAuth } from '../../context'

import useForm from '../../utils'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const licenseFileUploadRef = useRef()
  const stampFileUploadRef = useRef()
  const navigate = useNavigate()
  const { accountAddress, signature } = useAuth()

  const { submit, setFormField, errors, formData, canSubmit } = useForm({
    constraints: {
      firstName: {
        presence: true
      },
      lastName: {
        presence: true
      },
      license: {
        presence: true
      },
      stamp: {
        presence: true
      }
    },
    data: {
      firstName: null,
      lastName: null,
      license: null,
      stamp: null
    }
  })

  const handleSubmit = useCallback(async () => {
    setIsSubmiting(true)
    await signUpNotary(
      accountAddress,
      signature,
      formData.firstName,
      formData.lastName
    )
    setIsSubmiting(false)
    navigate('/notary')
  }, [formData])

  return (
    <div>
      <h1>Sign up as a Notary</h1>
      <span className="p-float-label mb-2">
        <InputText
          id="firstName"
          disabled={isSubmiting}
          value={formData.firstName || ''}
          onChange={(e) => setFormField('firstName', e.target.value || null)}
        />
        <label htmlFor="firstName">First name</label>
      </span>

      {errors?.firstName && <div className="p-error">{errors.firstName}</div>}
      <span className="p-float-label mb-2">
        <InputText
          id="lastName"
          disabled={isSubmiting}
          value={formData.lastName || ''}
          onChange={(e) => setFormField('lastName', e.target.value)}
        />
        <label htmlFor="lastName">Last name</label>
      </span>
      {errors?.lastName && <div className="p-error">{errors.lastName}</div>}
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
          onChange={(e) => setFormField('license', e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      {errors?.license && <div className="p-error">{errors.license}</div>}
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
          onChange={(e) => setFormField('stamp', e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      {errors?.stamp && <div className="p-error">{errors.stamp}</div>}
      <Button
        label="Sign up"
        loading={isSubmiting}
        disabled={!canSubmit}
        onClick={(e) => submit(handleSubmit, e)}
      />
    </div>
  )
}
