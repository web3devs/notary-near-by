import { useState } from 'react';
import { Menu } from 'primereact/menu';
import { StatusNew, StatusStarted, StatusFinished, StatusCanceled } from '../../../order';
import {
    useWS,
    useAuth,
} from '../../../context';

export const Flow = ({ orderID }) => {
    const [ state, setState ] = useState(StatusNew);
    const {
        ceremonyAction,
    } = useWS();
    const { publicKey, signature } = useAuth();

    const start = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'start')
        setState(StatusStarted)
    }

    const finish = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'finish')
        setState(StatusFinished)
    }

    const cancel = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'cancel')
        setState(StatusCanceled)
    }

    return (
        <Menu className="mb-2" model={[
            {
                label: 'Ceremony',
                items: [
                    { label: 'Start', icon: 'pi pi-play', className: 'bg-primary-500', command: start, disabled: state !== StatusNew },
                    { label: 'Finish', icon: 'pi pi-stop', className: 'bg-green-500', command: finish, disabled: state !== StatusStarted },
                    { label: 'Cancel', icon: 'pi pi-exclamation-triangle', className: 'bg-red-500', command: cancel, disabled: state !== StatusStarted },
                ]
            },
        ]} />
    )
};