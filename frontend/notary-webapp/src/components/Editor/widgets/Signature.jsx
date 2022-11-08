import { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useAuth } from '../../../context';
import { StatusNew, StatusStarted } from '../../../order';

export const SignatureWidget = ({ disabled, widget, status, participantsJoined, updateWidget, deleteWidget }) => {
    let { x, y, value } = widget;
    const [participants, setParticipants] = useState([]);
    const [valid, setValid] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isSignable, setIsSignable] = useState(false);
    const [signMode, setSignMode] = useState(false);
    const [v, setV] = useState({first_name: '', last_name: '', public_key: ''});

    const { accountAddress, role } = useAuth();

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

    useEffect(() => {
        if (participantsJoined) {
            let pts = [];
            if (participantsJoined) {
                for (const [k, p] of Object.entries(participantsJoined)) {
                    pts.push({
                        label: `${p.first_name} ${p.last_name}`,
                        public_key: k,
                        first_name: p.first_name,
                        last_name: p.last_name,
                    })
                }
                setParticipants(pts);
            }
            setIsSignable(role === 'participant' && status === StatusStarted);
        }
    }, [participantsJoined]);

    const removeWidget = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteWidget(widget)
    }

    const toggleEdit = () => {
        setEditMode(!editMode);
    }

    const toggleSign = () => {
        setSignMode(!signMode);
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

            {
                (isSignable && accountAddress === widget.value.public_key) && (
                    <div className="sign-menu" onClick={() => { e.preventDefault(); e.stopPropagation(); }}>
                        <i className="pi pi-file-edit" onClick={toggleSign} />
                    </div>
                )
            }

            <Dialog header="Edit" visible={editMode} onHide={() => setEditMode(false)}>
                <Dropdown optionLabel="label" value={v} options={participants} onChange={(e) => selectParticipant(e.value)} placeholder="Select Participant" />
            </Dialog>

            <Dialog header="Sign" visible={signMode} onHide={() => setSignMode(false)}>
                TODO: SIGN form :)
                {/* <Dropdown optionLabel="label" value={v} options={participants} onChange={(e) => selectParticipant(e.value)} placeholder="Select Participant" /> */}
            </Dialog>
        </Rnd>
    )
};