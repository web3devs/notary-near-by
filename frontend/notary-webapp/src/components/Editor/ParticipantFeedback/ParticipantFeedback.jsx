import { Button, Dialog, ProgressSpinner } from 'primereact';
import { StatusFinished,StatusDocumentSigned, StatusDocumentSigningConfirmed } from '../../../order';
import { useNavigate } from 'react-router-dom'

export const ParticipantFeedback = ({ order, status }) => {
    const navigate = useNavigate();

    return (
        <Dialog header="Ceremony aftermath" visible={status === StatusFinished || status === StatusDocumentSigned || status === StatusDocumentSigningConfirmed} closable={false} draggable={false} resizable={false}>
            <div className="flex flex-column">
                {(status === StatusFinished || status === StatusDocumentSigned) && (<div className="text-center"><ProgressSpinner /><div className="mt-2">Notary is signing files, please wait...</div></div>)}
                {status === StatusDocumentSigningConfirmed && (<div className="text-center">
                    The ceremony is over now.<br />
                    Please head to the Claim page, there you'll mint ownership token and then be able to download signed document.<br />
                    <Button label="Claim" className="mt-2" onClick={() => navigate(`/participant/claim/${order.id}`)} icon="pi pi-sign-out" iconPos="right" />
                </div>)}
            </div>
        </Dialog>
    )
};