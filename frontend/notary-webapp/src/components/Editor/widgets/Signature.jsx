import { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Dialog, Button, Dropdown } from 'primereact';
import { useAuth } from '../../../context';
import { StatusStarted } from '../../../order';
import { sign } from '../../../contracts'

export const SignatureWidget = ({ disabled, widget, status, participantsJoined, updateWidget, deleteWidget }) => {
    let { x, y, value } = widget;
    let { signature } = value;
    const [participants, setParticipants] = useState([]);
    const [valid, setValid] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isSignable, setIsSignable] = useState(false);
    const [signMode, setSignMode] = useState(false);
    const [v, setV] = useState({full_name: '', public_key: ''});

    const { accountAddress, getRole, publicKey } = useAuth();
    const role = getRole();

    useEffect(() => {
        if (value) {
            setV({...value});
        }
    }, [value])

    useEffect(() => {
        const { full_name, public_key } = v;
        if (full_name !== '', public_key !== '') {
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
                        label: `${p.full_name}`,
                        public_key: k,
                        full_name: p.full_name,
                    })
                }
                setParticipants(pts);
            }
            setIsSignable(role === 'participant' && status === StatusStarted && !signature);
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

    const selectParticipant = ({public_key, full_name}) => {
        const n = { label: `${full_name}`, public_key, full_name };
        setV(n)
    }

    const save = async () => {
        await updateWidget({ ...widget, value: v });
        setEditMode(false);
    }

    const handleSign = async () => {
        const r = await sign(JSON.stringify(widget))
        const val = {...v, signature: r}
        await updateWidget({ ...widget, value: val });
        setSignMode(false);
    }


    return (
        <Rnd
            size={{ width: 250, height: 15 }}
            enableResizing={false}
            bounds="parent"
            disableDragging={disabled || editMode || signature}
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
            {`${v.full_name}`}
            { !disabled && !signature && (
                <div className="context-menu" onClick={() => { e.preventDefault(); e.stopPropagation(); }}>
                    <i className="pi pi-file-edit" onClick={toggleEdit} />
                    <i className="pi pi-trash" onClick={removeWidget} />
                </div>
            )}

            {
                (isSignable && accountAddress === widget.value.public_key) && (
                    <div className="sign-menu" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <i className="pi pi-file-edit" onClick={toggleSign} />
                    </div>
                )
            }

            {
                (signature) && (
                    <div className="sign-menu cursor-auto">
                        <i className="bg-green-500 text-white pi pi-check-square cursor-auto" />
                    </div>
                )
            }

            <Dialog header="Edit" visible={editMode} onHide={() => setEditMode(false)} footer={<Button onClick={save} label="Save" />}>
                <Dropdown optionLabel="label" value={v} options={participants} onChange={(e) => selectParticipant(e.value)} placeholder="Select Participant" />
            </Dialog>

            <Dialog header="Sign" visible={signMode} onHide={() => setSignMode(false)} footer={<Button label="Sign" onClick={handleSign} />}>
                You'll be asked to sign this field with Metamask.
            </Dialog>
        </Rnd>
    )
};