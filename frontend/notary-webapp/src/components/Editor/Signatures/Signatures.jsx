import { Button } from 'primereact/button';
import './style.css';

export const Signatures = ({ publicKey, widgets, setPage }) => {
    const sigs = widgets.filter(w => {
        if (w.type === 'signature' && w.value.public_key === publicKey) {
            return true;
        }

        return false;
    });

    if (sigs.length === 0) return null;

    return (
        <>
            <div className="mb-2">
                <strong>Signatures:</strong>
                {sigs.map((s, idx) => <Button key={`sig-idx`} label={`${s.value.first_name} ${s.value.last_name} / Page: ${s.page}`} onClick={() => setPage(s.page)} />)}
            </div>
        </>
    )

    console.log('Sigs: ', sigs);

    return 'TODO: Signatures';
    // const nj = notary_joined;

    // return (
    //     <>
    //         <div className="mb-2">
    //             <strong>Notary:</strong><br />
    //             {nj && (
    //                 <Chip label={`${nj.first_name} ${nj.last_name}`} icon="pi pi-check" className="bg-green-500" />
    //             )}
    //             {!nj && (
    //                 <Chip label={`Waiting for Notary`} icon="pi pi-times" className="bg-orange-500" />
    //             )}
    //         </div>

    //         <UsersList prefix="participant" label="Participants" required={participants} joined={participants_joined ? participants_joined : []} />
    //         <UsersList prefix="witness" label="Witnesses" required={witnesses} joined={witnesses_joined ? witnesses_joined : []} />
    //     </>
    // )
};