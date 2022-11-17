import {Button, Dropdown, InputText, Calendar, Messages} from 'primereact'
import {useState, useCallback, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {signUpNotary as cSignupNotary} from '../../contracts'
import {signUpNotary} from '../../api'
import FileUpload from '../../components/FileUpload'
import useForm from '../../utils'
import {useAuth} from '../../context'
import Settings from '../../settings/contracts.json'
import {Dialog} from "primereact/dialog";

export default () => {
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [isTokenMinted, setTokenMinted] = useState(false)
    const [wasAdded, setWasAdded] = useState(false)
    const {publicKey, signature} = useAuth()
    const navigate = useNavigate()
    const messages = useRef()

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

        await signUpNotary({
            ...formData,
            publicKey,
            signature,
        }).then(n => {
            return cSignupNotary({
                idNumber: n.id_number,
                metadataURL: `https://ipfs.io/ipfs/${n.cid}/metadata.json`
            })
        }).then(() => {
            setTokenMinted(true)
        }).catch(e => {
            console.error(JSON.stringify(e))
            messages.current.show({
                severity: 'error',
                summary: 'Minting error',
                detail: e.message,
                sticky: true
            });

        }).then(() => setIsSubmiting(false))
    }, [formData])

    const addTokenToMetamask = async () => {
        const {address, symbol, image} = Settings.NotaryNft
        try {
            const wasAdded = await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: address,
                        symbol: symbol,
                        decimals: 0,
                        image: image,
                    },
                },
            });
            setWasAdded(wasAdded)
            navigate('/notary')
        } catch (error) {
            console.log(error);
        }
    }

    const tokenMintedDialogContents = (
        <>
            <p className="p-card-subtitle">
                Your notary creditials have been verified.
            </p>
            <p>
                An NFT has been added to your Metamask wallet that proves that you are a notary and authorizes
                you to perform remote notarizations using this system. In order to display it, Metamask needs to
                be configured with some details about the token. Click the button to add the token details to your
                metamask wallet.
            </p>
            <div className='text-center'>
                <Button onClick={addTokenToMetamask}>Add token to metamask</Button>
            </div>
        </>
    )

    return (
        <div className="flex flex-column align-items-center">
            <Messages ref={messages}/>
            <Dialog
                header="Congratulations!"
                visible={isTokenMinted && !wasAdded}
                style={{width: '50vw'}}
                onHide={() => navigate('/notary')}
            >
                {tokenMintedDialogContents}
            </Dialog>

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
