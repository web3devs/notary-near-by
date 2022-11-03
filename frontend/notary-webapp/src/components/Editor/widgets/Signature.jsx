import { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

export const SignatureWidget = ({ disabled, widget, order, updateWidget, deleteWidget }) => {
    let { x, y, value } = widget;
    const [valid, setValid] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [v, setV] = useState({first_name: '', last_name: '', public_key: ''});

    useEffect(() => {
        if (value) {
            setV({...value});
        }
    }, [value])

    useEffect(() => {
        const { first_name, last_name, public_key } = v;
        if (first_name !== '', last_name !== '', public_key !== '') {
            setValid(true);
            return;
        }
        setValid(false);
    }, [v]);

    const { participants_joined } = order;
    let participants = [];
    if (participants_joined) {
        for (const [k, p] of Object.entries(participants_joined)) {
            participants.push({
                label: `${p.first_name} ${p.last_name}`,
                public_key: k,
                first_name: p.first_name,
                last_name: p.last_name,
            })
        }
    }

    const removeWidget = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteWidget(widget)
    }

    const toggleEdit = () => {
        setEditMode(!editMode);
    }

    const selectParticipant = ({public_key, first_name, last_name}) => {
        const n = { label: `${first_name} ${last_name}`, public_key, first_name, last_name };
        setV(n)
        updateWidget({...widget, value: n})
    }

    return (
        <Rnd
            size={{ width: 250, height: 15 }}
            enableResizing={false}
            bounds="parent"
            disableDragging={disabled || editMode}
            className={`widget widget-signature widget-is-valid-${valid} p-overlay-badge`}
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();
            }}
            position={{ x, y }}
            onDragStop={(e, d) => {
                if (disabled) return;
                if (e.srcElement.className === 'pi pi-trash') {
                    return;
                }

                if (e.srcElement.className === 'pi pi-file-edit') {
                    return;
                }
                updateWidget({ ...widget, x: d.x, y: d.y })
            }}
        >
            {`${v.first_name} ${v.last_name}`}
            { !disabled && (
                <div className="context-menu" onClick={() => { e.preventDefault(); e.stopPropagation(); }}>
                    <i className="pi pi-file-edit" onClick={toggleEdit} />
                    <i className="pi pi-trash" onClick={removeWidget} />
                </div>
            )}

            <Dialog header="Edit" visible={editMode} onHide={() => setEditMode(false)}>
                <Dropdown optionLabel="label" value={v} options={participants} onChange={(e) => selectParticipant(e.value)} placeholder="Select Participant" />
            </Dialog>
        </Rnd>
    )
};