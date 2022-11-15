import { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useAuth } from '../../../context';
import { StatusNew, StatusStarted } from '../../../order';

export const NotaryStampWidget = ({ disabled, widget, status, participantsJoined, updateWidget, deleteWidget }) => {
    let { x, y, value } = widget;
    const [participants, setParticipants] = useState([]);
    const [valid, setValid] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isSignable, setIsSignable] = useState(false);
    const [signMode, setSignMode] = useState(false);
    const [v, setV] = useState({full_name: '', public_key: ''});

    const { accountAddress, role } = useAuth();

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

    const selectParticipant = ({public_key, full_name}) => {
        const n = { label: `${full_name}`, public_key, full_name };
        setV(n)
        updateWidget({...widget, value: n})
    }

    return (
        <Rnd
            size={{ width: 200, height: 100 }}
            enableResizing={false}
            bounds="parent"
            disableDragging={disabled || editMode}
            className={`widget widget-notary-stamp widget-is-valid-${valid} p-overlay-badge text-center`}
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
            <div className="flex flex-column justify-content-center align-items-center">
                <div style={{ fontSize: '12px' }} className="font-bold mt-1">Notary Public<br />State of Washington</div>
                <div style={{ fontSize: '10px' }} className="font-italic font-bold text-lg mt-1 mb-1">{`${v.full_name}`}</div>
                <div style={{ fontSize: '10px' }}  className="text-sm">My Commission Expires<br />November 18, 2035</div>
            </div>
            { !disabled && (
                <div className="context-menu" onClick={() => { e.preventDefault(); e.stopPropagation(); }}>
                    {/* <i className="pi pi-file-edit" onClick={toggleEdit} /> */}
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