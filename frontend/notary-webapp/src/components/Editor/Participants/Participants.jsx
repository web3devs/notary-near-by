import { Chip } from 'primereact/chip';
import './style.css';

export const Participants = ({ notary_joined, participants, participants_joined, witnesses, witnesses_joined }) => {
    const nj = notary_joined;
    const pj = participants_joined ? participants_joined : [];
    const wj = witnesses_joined ? witnesses_joined : [];

    const pjw = (
        <>
        {
            participants.map((p, idx) => {
                if (pj[p]) {
                    return <Chip key={`participant-${idx}`} label={`${pj[p].first_name} ${pj[p].last_name}`} icon="pi pi-check" className="bg-green-500" />
                }
                return <Chip key={`participant-${idx}`} label={`${p}`} icon="pi pi-times" className="bg-orange-500" />
            })
        }
        </>
    );

    const wjw = (
        <>
            {
                witnesses.map((p, idx) => {
                    if (wj[p]) {
                        return <Chip key={`witness-${idx}`} label={`${wj[p].first_name} ${wj[p].last_name}`} icon="pi pi-check" className="bg-green-500" />
                    }
                    return <Chip key={`witness-${idx}`} label={`${p}`} icon="pi pi-times" className="bg-orange-500" />
                })
            }
        </>
    );

    return (
        <>
            <div className="mb-2">
                <strong>Notary:</strong><br />
                {nj && (
                    <Chip label={`${nj.first_name} ${nj.last_name}`} icon="pi pi-check" className="bg-green-500" />
                )}
                {!nj && (
                    <Chip label={`Waiting for Notary`} icon="pi pi-times" className="bg-orange-500" />
                )}
            </div>

            {pjw && (
                <div className="mb-2">
                    <strong>Participants:</strong><br />
                    {pjw}
                </div>
            )}

            {wjw && (
                <div className="mb-2">
                    <strong>Witnesses:</strong><br />
                    {wjw}
                </div>
            )}
        </>
    )

};