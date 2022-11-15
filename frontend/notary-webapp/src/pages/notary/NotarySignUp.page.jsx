import {Button, Dropdown, InputText, Calendar} from 'primereact'
import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {signUpNotary} from '../../contracts'
import {useAuth} from '../../context'
import FileUpload from '../../components/FileUpload'
import useForm from '../../utils'

export default () => {
    const [isSubmiting, setIsSubmiting] = useState(false)
    const navigate = useNavigate()
    const {accountAddress, signature} = useAuth()

    const {submit, setFormField, errors, formData, canSubmit} = useForm({
        constraints: {
            fullName: {
                presence: true
            },
            commissionAuthority: {
                inclusion: {
                    within: {"FL": "Florida", "WA": "Washington", "TX": "Texas"},
                    message: "^We don't currently support notaries from %{value}"
                }
            },
            notaryIdNumber: {
                presence: true
            },
            commissionExpirationDate: {
                // TODO Using date instead of datetime breaks this due to timezone stuff
                datetime: true
                // FIXME It should verify that the date is in the future
                // datetime: {
                //   earliest: moment.utc().add(1, 'day'),
                //   message: "must be in the future"
                // }
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
            commissionAuthority: null,
            notaryIdNumber: null,
            commissionExpirationDate: null,
            license: null,
            stamp: null
        }
    })

    const commissionAuthorityOptions = [{
        label: "Washington",
        value: "WA",
    }, {
        label: "Florida",
        value: "FL",
    }, {
        label: "Texas",
        value: "TX",
    }]

    const handleSubmit = useCallback(async () => {
        setIsSubmiting(true)
        await signUpNotary(formData)
        setIsSubmiting(false)
        navigate('/notary')
    }, [formData])

    return (
        <div className="flex flex-column align-items-center">
            <div className="flex flex-column align-items-center mb-4" style={{maxWidth: '400px'}}>
                <h1>Sign up as a Notary</h1>
                <div className="text-500 text-center">lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem
                    dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem
                </div>
            </div>
            <div className="flex justify-content-center align-items-top h-screen" style={{width: '400px'}}>
                <div className="flex-column w-full">
                    <div className="field mb-3">
                        <label htmlFor="firstName">First name</label>
                        <InputText
                            id="fullName"
                            disabled={isSubmiting}
                            value={formData.fullName || ''}
                            onChange={(e) => setFormField('fullName', e.target.value || null)}
                            className="w-full"
                        />
                        {errors?.fullName && <div className="p-error">{errors.fullName}</div>}
                    </div>

                    <div className="field mb-3">
                        <label htmlFor="commissionAuthority">Where are you commissioned?</label>
                        <Dropdown
                            id="commissionAuthority"
                            disabled={isSubmiting}
                            options={commissionAuthorityOptions}
                            value={formData.commissionAuthority || ''}
                            onChange={(e) => setFormField('commissionAuthority', e.value)}
                        />
                        {errors?.commissionAuthority && <div className="p-error">{errors.commissionAuthority}</div>}
                    </div>

                    <div className="field mb-3">
                        <label htmlFor="notaryIdNumber">ID Number</label>
                        <InputText
                            id="notaryIdNumber"
                            disabled={isSubmiting}
                            value={formData.notaryIdNumber || ''}
                            onChange={(e) =>
                                setFormField('notaryIdNumber', e.target.value)
                            }
                            className="mb-4"
                        />
                        {errors?.notaryIdNumber && <div className="p-error">{errors.notaryIdNumber}</div>}
                    </div>

                    <div className="field mb-3">
                        <label htmlFor="commissionExpirationDate">Commission expiration date</label>
                        <Calendar
                            id="commissionExpirationDate"
                            disabled={isSubmiting}
                            value={formData.commissionExpirationDate || ''}
                            onChange={(e) => setFormField(
                                'commissionExpirationDate',
                                e.value)
                            }
                            showIcon={true}
                            dateFormat='m/d/yy'
                        />
                        {errors?.commissionExpirationDate &&
                        <div className="p-error">
                            {errors.commissionExpirationDate}
                        </div>
                        }
                    </div>

                    <div className="flex flex-start flex-column align-items-start gap-2 mb-3">
                        <FileUpload
                            label="License"
                            error={errors?.license}
                            accept=".png,.jpg,.jpeg"
                            onFileChange={(e) => setFormField('license', e[0])}
                            disabled={isSubmiting}
                        />
                    </div>
                    <div className="flex flex-start flex-column align-items-start gap-2 mb-3">
                        <FileUpload
                            label="Stamp"
                            error={errors?.stamp}
                            accept=".png,.jpg,.jpeg"
                            onFileChange={(e) => setFormField('stamp', e[0])}
                            disabled={isSubmiting}
                        />
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
