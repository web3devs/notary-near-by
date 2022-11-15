import { Chip } from 'primereact/chip';
import './style.css';

const UsersList = ({ prefix, label, required, joined }) => {
    console.log('UsersList', label, ': ', required, joined)

    if (!required || required.length === 0) return;

    return (
        <div className="mb-2">
            <strong>{label}:</strong><br />
            {
                required.map((p, idx) => {
                    if (joined[p]) {
                        return <Chip key={`${prefix}-${idx}`} label={`${joined[p].full_name}`} icon="pi pi-check" className="bg-green-500" />
                    }
                    return <Chip key={`${prefix}-${idx}`} label={`${p}`} icon="pi pi-times" className="bg-orange-500" />
                })
            }
        </div>
    )
};

export const Participants = ({ notary_joined, participants, participants_joined, witnesses, witnesses_joined }) => {
    const nj = notary_joined;

    return (
        <>
            <div className="mb-2">
                <strong>Notary:</strong><br />
                {nj && (
                    <Chip label={`${nj.full_name}`} icon="pi pi-check" className="bg-green-500" />
                )}
                {!nj && (
                    <Chip label={`Waiting for Notary`} icon="pi pi-times" className="bg-orange-500" />
                )}
            </div>

            <UsersList prefix="participant" label="Participants" required={participants} joined={participants_joined ? participants_joined : []} />
            <UsersList prefix="witness" label="Witnesses" required={witnesses} joined={witnesses_joined ? witnesses_joined : []} />
        </>
    )

};