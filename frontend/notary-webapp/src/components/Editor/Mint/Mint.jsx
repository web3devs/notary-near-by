import { useState } from 'react';
import { Button, Dialog, ProgressSpinner } from 'primereact';
import { StatusFinished,StatusDocumentSigned, StatusDocumentSigningConfirmed } from '../../../order';
import { createNotarizedDocument } from '../../../contracts/index'
import { confirmSigning as apiConfirmSigning } from '../../../api'
import { ipfsURL } from '../../../utils/ipfs'
import { useNavigate } from 'react-router-dom'

export const Mint = ({ order, status }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const confirmSigning = async (o) => {
        try {
            setIsLoading(() => true)
            await createNotarizedDocument({
                authorizedMinter: o.owner,
                price: 0.000001, //?????
                metadataURI: ipfsURL(o.cid)
            })

            await apiConfirmSigning({ orderID: o.id })
        } catch (e) {
            console.error(e)
        }
        finally {
            setIsLoading(() => false)
        }
    }

    return (
        <Dialog header="Minting" visible={status === StatusFinished || status === StatusDocumentSigned || status === StatusDocumentSigningConfirmed} closable={false} draggable={false} resizable={false}>
            <div className="flex flex-column">
                {status === StatusFinished && (<div className="text-center"><ProgressSpinner /><div className="mt-2">Generating files, please wait...</div></div>)}
                {status === StatusDocumentSigned && (<div className="text-center">
                    Please confirm signing with your wallet:<br />
                    <Button label="Confirm signing" className="mt-2" onClick={() => confirmSigning(order)} disabled={isLoading} loading={isLoading} icon={isLoading ? 'pi pi-spinner' : 'pi pi-pencil'} iconPos="right" />
                </div>)}

                {status === StatusDocumentSigningConfirmed && (<div className="text-center">
                    This is it! You can leave the meeting now!<br />
                    <Button label="Leave" className="mt-2" onClick={() => navigate('/notary')} icon="pi pi-sign-out" iconPos="right" />
                </div>)}
            </div>
        </Dialog>
    )
};