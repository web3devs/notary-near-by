import { Menu } from 'primereact/menu';
import { Message } from 'primereact/message';
import { StatusNew, StatusStarted, StatusNotaryJoined } from '../../../order';
import {
    useWS,
    useAuth,
} from '../../../context';

export const Flow = ({ orderID, state, widgets }) => {
    const {
        ceremonyAction,
    } = useWS();
    const { publicKey, signature } = useAuth();

    const start = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'start')
    }

    const finish = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'finish')
    }

    const cancel = async () => {
        await ceremonyAction(orderID, publicKey, signature, 'cancel')
    }

    const hasEmptyTexts = widgets.filter(w => w.type === 'text').filter(w => w.value === '').length > 0
    const hasEmptyDates = widgets.filter(w => w.type === 'date').filter(w => w.value === '').length > 0
    const hasEmptySignatures = widgets.filter(w => w.type === 'signature').filter(w => w.value === '').length > 0
    const hasValidFields = !hasEmptyDates && !hasEmptySignatures && !hasEmptyTexts

    const hasUnsignedSignatures = widgets.filter(w => w.type === 'signature').filter(w => !w.value.signature).length > 0

    const canStart = state === StatusNew || state === StatusNotaryJoined
    const canFinish = state === StatusStarted && !hasUnsignedSignatures && !hasEmptyTexts
    const canCancel = state === StatusStarted //Can cancel at any time?

    return (
        <div>
            {hasEmptyTexts && (<Message severity="warn" text="Some Texts are empty!" className="mb-2" />)}
            {hasEmptyDates && (<Message severity="warn" text="Some Dates are empty!" className="mb-2" />)}
            {hasEmptySignatures && (<Message severity="warn" text="Some Signatures are empty!" className="mb-2" />)}
            {hasValidFields && hasUnsignedSignatures && (<Message severity="warn" text="Some Signatures are not signed!" className="mb-2" />)}
            {!hasUnsignedSignatures && (<Message severity="success" text="Everything is singned - you can finish now" className="mb-2" />)}

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
        </div>
    )
};