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
      fullName: {
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
      fullName: null,
      license: null,
      stamp: null
    }
  })

  const handleSubmit = useCallback(async () => {
    setIsSubmiting(true)
    await signUpNotary(
      accountAddress,
      signature,
      formData.fullName,
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
            <label htmlFor="fullName" className="block">Full name</label>
            <InputText
              id="fullName"
              disabled={isSubmiting}
              value={formData.fullName || ''}
              onChange={(e) => setFormField('fullName', e.target.value || null)}
              className="w-full"
            />
            {errors?.fullName && <div className="p-error">{errors.fullName}</div>}
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
