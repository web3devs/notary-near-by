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
                {sigs.map((s, idx) => <Button key={`sig-idx`} label={`${s.value.full_name} / Page: ${s.page}`} onClick={() => setPage(s.page)} />)}
            </div>
        </>
    )
};