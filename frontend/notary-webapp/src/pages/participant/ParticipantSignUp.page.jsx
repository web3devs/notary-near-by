import { InputText } from 'primereact'
import { Button } from 'primereact'
import { useEffect } from 'react'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpParticipant } from '../../api'
import { Card } from 'primereact/card';
import { useAuth } from '../../context'
import useForm from '../../utils'

export default () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { accountAddress, signature } = useAuth()
  const { formData, errors, submit, setFormField, canSubmit } = useForm({
    data: {
      fullName: null,
      ID: null
    },
    constraints: {
      fullName: {
        presence: {
          notEmpty: true
        }
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
      formData.fullName,
    )
    setIsSubmiting(false)
    navigate('/participant')
  }, [formData])

  return (
    <div className="flex flex-column align-items-center">
      <div className="flex flex-column align-items-center mb-4" style={{ maxWidth: '400px' }}>
        <h1>New Participant</h1>
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
            {errors?.fullName && (
              <div className="p-error">{errors.fullName}</div>
            )}
          </div>

          <div className="flex flex-start flex-column align-items-start gap-2 mb-3">
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
            className="w-full"
            iconPos="right"
          />
        </div>
      </div>
    </div>
  )
}
