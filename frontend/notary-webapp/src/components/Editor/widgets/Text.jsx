import { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

export const TextWidget = ({ disabled, widget, updateWidget, deleteWidget }) => {
    const [valid, setValid] = useState(false);
    let { x, y, value } = widget;
    const [editMode, setEditMode] = useState(false);
    const [v, setV] = useState('');

    useEffect(() => {
        if (value) {
            setV(value);
        }
    }, [value])

    useEffect(() => {
        if (v !== '') {
            setValid(true);
            return;
        }
        setValid(false);
    }, [v]);

    const removeWidget = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteWidget(widget)
    }

    const toggleEdit = () => {
        setEditMode(!editMode);
    }

    const save = async () => {
        await updateWidget({ ...widget, value: v });
        setEditMode(false);
    }

    return (
        <Rnd
            size={{ width: 250, height: 15 }}
            enableResizing={false}
            bounds="parent"
            disableDragging={disabled || editMode}
            className={`widget widget-text widget-is-valid-${valid} p-overlay-badge`}
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
            {v}
            { !disabled && (
                <div className="context-menu" onClick={() => { e.preventDefault(); e.stopPropagation(); }}>
                    <i className="pi pi-file-edit" onClick={toggleEdit} />
                    <i className="pi pi-trash" onClick={removeWidget} />
                </div>
            )}

            <Dialog header="Edit" footer={<Button onClick={save} label="Save" />} visible={editMode} onHide={() => setEditMode(false)}>
                <InputTextarea rows={5} cols={30} value={v} onChange={(e) => setV(e.target.value)} autoResize />
            </Dialog>
        </Rnd>
    )
};