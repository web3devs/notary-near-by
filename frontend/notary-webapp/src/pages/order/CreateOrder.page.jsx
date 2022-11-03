import { Button, Dialog, Dropdown, InputText } from 'primereact'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FileUpload from '../../components/FileUpload'
import { useAuth } from '../../context'
import { signMessage } from '../../contracts'

const options = [
  'Attestation of title',
  'Purchase and Sale',
  'Last Will/Testament'
]
export default () => {
  const { accountAddress } = useAuth()
  const [type, setType] = useState(options[0])
  const [newAddress, setNewAddress] = useState('')
  const [showAddWitness, setShowAddWitness] = useState(false)
  const [showAddParticipant, setSHowAddParticipant] = useState(false)
  const [witnesses, setWitnesses] = useState([])
  const [participants, setParticipants] = useState([])
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [file, setFile] = useState(null)
  useEffect(() => {
    ;(async () => {
      console.log()
    })()
  }, [])
  const handleSubmit = useCallback(() => {}, [accountAddress])

  const handleAddWitness = () => {
    setWitnesses((prev) => [...prev, newAddress])
    setNewAddress('')
    setShowAddWitness(false)
  }
  const handleAddParticipant = () => {
    setParticipants((prev) => [...prev, newAddress])
    setNewAddress('')
    setSHowAddParticipant(false)
  }
  const handleRemoveWitness = (witness) => {
    setWitnesses((prev) => [...prev.filter((w) => w !== witness)])
  }
  const handleRemoveParticipants = (participant) => {
    setParticipants((prev) => [...prev.filter((w) => w !== participant)])
  }
  return (
    <div className="flex flex-column justify-items-center align-items-start">
      <h1>Create order</h1>

      <div className="text-lg text-300 mb-4">Document type</div>
      <Dropdown
        options={options}
        value={type}
        onChange={(e) => {
          setType(e.value)
        }}
        className="mb-4"
      />
      <div className="text-lg text-300 mb-4">Witnesses</div>
      {witnesses.map((w) => {
        return (
          <div
            className="flex justify-content-between mb-2 w-5 align-items-center p2"
            key={w}
          >
            <span className="mr-4">{w}</span>
            <Button onClick={() => handleRemoveWitness(w)}>
              <i className="pi pi-trash px-2"></i>
            </Button>
          </div>
        )
      })}
      {witnesses.length === 0 && (
        <div className="text-sm text-100 mb-4">No witnesses yet</div>
      )}
      <Button
        label="Add witness"
        onClick={() => setShowAddWitness(true)}
        className="mb-2"
      />

      <div className="text-lg text-300 mb-4">Participants</div>
      {participants.map((w) => {
        return (
          <div
            className="flex justify-content-between mb-2 w-5 align-items-center border-round-xs"
            key={w}
          >
            <span className="mr-4">{w}</span>
            <Button onClick={() => handleRemoveParticipants(w)}>
              <i className="pi pi-trash px-2"></i>
            </Button>
          </div>
        )
      })}
      {participants.length === 0 && (
        <div className="text-sm text-100 mb-4">No participants yet</div>
      )}
      <Button
        label="Add participant"
        className="mb-4"
        onClick={() => setSHowAddParticipant(true)}
      />

      <FileUpload onFileChange={setFile} disabled={isSubmiting} />
      <Button label="Save" onClick={handleSubmit} />
      <Dialog
        visible={showAddWitness}
        onHide={() => setShowAddWitness(false)}
        header="Add witness"
      >
        <div className="flex-column flex">
          <InputText
            className="mb-2"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <Button
            label="Add"
            onClick={handleAddWitness}
            disabled={!newAddress || !newAddress.length}
          />
        </div>
      </Dialog>
      <Dialog
        visible={showAddParticipant}
        onHide={() => showAddParticipant(false)}
        header="Add participant"
      >
        <div className="flex-column flex">
          <InputText
            className="mb-2"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <Button
            label="Add"
            onClick={handleAddParticipant}
            disabled={!newAddress || !newAddress.length}
          />
        </div>
      </Dialog>
    </div>
  )
}
