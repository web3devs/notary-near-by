import {Button, Dropdown, InputText, Calendar} from 'primereact'
import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import { signUpNotary as cSignupNotary } from '../../contracts'
import { signUpNotary } from '../../api'
import FileUpload from '../../components/FileUpload'
import useForm from '../../utils'
import { useAuth } from '../../context'

export default () => {
    const [isSubmiting, setIsSubmiting] = useState(false)
    const { publicKey, signature } = useAuth()
    const navigate = useNavigate()

    const {submit, setFormField, errors, formData, canSubmit} = useForm({
        constraints: {
            fullName: {
                presence: true
            },
            state: {
                presence: true,
                inclusion: {
                    within: {"FL": "Florida", "WA": "Washington", "TX": "Texas"},
                    message: "^We don't currently support notaries from %{value}"
                }
            },
            idNumber: {
                presence: true
            },
            commissionExpirationDate: {
                presence: true,
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
        },
        data: {
            fullName: null,
            state: null,
            idNumber: null,
            commissionExpirationDate: null,
            license: null,
        }
    })

    const stateOptions = [{
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
        const n = await signUpNotary({
            ...formData,
            publicKey,
            signature,
        })
        await cSignupNotary({
            idNumber: n.id_number,
            metadataURL: `https://ipfs.io/ipfs/${n.cid}/metadata.json`
        })
        setIsSubmiting(false)
        navigate('/notary')
    }, [formData])

    return (
        <div className="flex flex-column align-items-center">
            <div className="flex flex-column align-items-center mb-4" style={{maxWidth: '400px'}}>
                <h1>New Notary</h1>
                <div className="text-500 text-center">lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem
                    dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem lorem dolorem
                </div>
            </div>
            <div className="flex justify-content-center align-items-top h-screen" style={{width: '400px'}}>
                <div className="flex-column w-full">
                    <div className="field mb-3">
                        <label htmlFor="fullName">Full name</label>
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
                        <label htmlFor="state">Where are you commissioned?</label>
                        <Dropdown
                            id="state"
                            disabled={isSubmiting}
                            options={stateOptions}
                            value={formData.state || ''}
                            onChange={(e) => setFormField('state', e.value)}
                            className="w-full"
                        />
                        {errors?.state && <div className="p-error">{errors.state}</div>}
                    </div>

                    <div className="field mb-3">
                        <label htmlFor="idNumber">ID Number</label>
                        <InputText
                            id="idNumber"
                            disabled={isSubmiting}
                            value={formData.idNumber || ''}
                            onChange={(e) =>
                                setFormField('idNumber', e.target.value)
                            }
                            className="w-full"
                        />
                        {errors?.idNumber && <div className="p-error">{errors.idNumber}</div>}
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
                            className="w-full"
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
                            helper="Use whatever - we're not storing this file. In production we would verify you really are a Notary."
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
