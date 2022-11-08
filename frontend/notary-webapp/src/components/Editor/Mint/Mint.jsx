import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { StatusNew, StatusStarted, StatusFinished, StatusCanceled } from '../../../order';
import {
    useWS,
    useAuth,
} from '../../../context';

export const Mint = ({ status }) => {
    const [ state, setState ] = useState(StatusNew);
    // const {
    //     mint,
    // } = useWS();
    const { publicKey, signature } = useAuth();

    const mint = async () => {
        // await ceremonyAction(order.id, publicKey, signature, 'start')
        // setState(StatusStarted)
    }

    return (
        <Dialog header="Mint" visible={status === StatusFinished} closable={false} draggable={false} resizable={false}>
            <h1>TODO: </h1>
            <ol>
                <li>Waitnig for documents to be signed</li>
                <li>If signed, show Minting functionality</li>
                <li>If minted, show document download URL and details</li>

            </ol>
        </Dialog>
    )
};