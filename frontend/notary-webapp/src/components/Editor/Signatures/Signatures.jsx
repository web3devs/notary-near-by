import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
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
        <Menu model={[
            {
              label: 'Signatures',
              items: sigs.map((s) => ({label: `${s.value.full_name} / p. ${s.page}`, icon: 'pi pi-book', command: () => setPage(s.page) }))
            },
        ]} className="w-full" />
    )
};