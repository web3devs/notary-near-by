import { useState } from 'react';
import { Menu } from 'primereact/menu';
import { StatusNew, StatusStarted, StatusNotaryJoined, StatusFinished, StatusCanceled } from '../../../order';
import {
    useWS,
    useAuth,
} from '../../../context';

export const Flow = ({ orderID, state }) => {
    const {
        ceremonyAction,
    } = useWS();
    const { publicKey, signature } = useAuth();

    const start = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'start')
        // setState(StatusStarted)
    }

    const finish = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'finish')
        // setState(StatusFinished)
    }

    const cancel = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'cancel')
        // setState(StatusCanceled)
    }

    const canStart = state === StatusNew || state === StatusNotaryJoined
    const canFinish = state === StatusStarted //TODO: Verify signatures are signed
    const canCancel = state === StatusStarted //Can cancel at any time?

    return (
        <Menu className="mb-2 w-full" model={[
            {
                label: 'Ceremony',
                items: [
                    { label: 'Start', icon: 'pi pi-play', className: 'bg-primary-500X', command: start, disabled: !canStart },
                    { label: 'Finish', icon: 'pi pi-stop', className: 'bg-green-500X', command: finish, disabled: !canFinish },
                    { label: 'Cancel', icon: 'pi pi-exclamation-triangle', className: 'bg-red-500X', command: cancel, disabled: !canCancel },
                ]
            },
        ]} />
    )
};