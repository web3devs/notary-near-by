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
    <div className="flex flex-column align-items-center">
      <div className="flex flex-column align-items-center mb-4" style={{ maxWidth: '400px' }}>
        <h1>New Notary</h1>
        <div className="text-500 text-center">lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem </div>
      </div>

      <div className="flex justify-content-center align-items-top h-screen" style={{ width: '400px' }}>
        <div className="flex-column w-full">
          <div className="field mb-3">
            <label htmlFor="firstName" className="block">First name</label>
            <InputText
              id="firstName"
              disabled={isSubmiting}
              value={formData.firstName || ''}
              onChange={(e) => setFormField('firstName', e.target.value || null)}
              className="w-full"
            />
            {errors?.firstName && <div className="p-error">{errors.firstName}</div>}
          </div>

          <div className="field mb-3">
            <label htmlFor="lastName" className="block">Last name</label>
            <InputText
              id="lastName"
              disabled={isSubmiting}
              value={formData.lastName || ''}
              onChange={(e) => setFormField('lastName', e.target.value)}
              className="w-full"
            />
            {errors?.lastName && <div className="p-error">{errors.lastName}</div>}
          </div>

          <div className="flex flex-start flex-column align-items-start gap-2 mb-3">
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
            {errors?.license && <div className="p-error">{errors.license}</div>}
          </div>

          <div className="flex flex-start flex-column align-items-start gap-2 mb-3">
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
            {errors?.stamp && <div className="p-error">{errors.stamp}</div>}
          </div>

          <Button
            label="Sign up"
            loading={isSubmiting}
            disabled={!canSubmit}
            onClick={(e) => submit(handleSubmit, e)}
            className="w-full"
            iconPos="right"
          />
        </div>
      </div>
    </div>
  )
}
