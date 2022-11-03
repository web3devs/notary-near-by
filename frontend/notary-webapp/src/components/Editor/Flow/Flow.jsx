import { useState } from 'react';
import { Menu } from 'primereact/menu';

export const Flow = ({ todoWidget, addTextWidget }) => {
    const [ state, setState ] = useState('new');

    return (
        <Menu className="mb-2" model={[
            {
                label: 'Ceremony',
                items: [
                    { label: 'Start', icon: 'pi pi-play', className: 'bg-primary-500', command: () => setState('started'), disabled: state !== 'new' },
                    { label: 'Finish', icon: 'pi pi-stop', className: 'bg-green-500', command: () => setState('finished'), disabled: state !== 'started' },
                    { label: 'Cancel', icon: 'pi pi-exclamation-triangle', className: 'bg-red-500', command: () => setState('canceled'), disabled: state !== 'started' },
                ]
            },
        ]} />
    )
};