import { Button, Dialog, Dropdown, InputText } from 'primereact'
import { useCallback, useEffect, useState } from 'react'
import { createOrer } from '../../api'
import FileUpload from '../../components/FileUpload'
import { useAuth } from '../../context'
import { useNavigate } from 'react-router-dom'
import useForm from '../../utils'

const options = [
  'Attestation of title',
  'Purchase and Sale',
  'Last Will/Testament'
]
export default () => {
  const { accountAddress } = useAuth()
  const navigate = useNavigate()

  const [newAddress, setNewAddress] = useState('')
  const [showAddWitness, setShowAddWitness] = useState(false)
  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { errors, formData, canSubmit, setFormField, submit } = useForm({
    data: {
      file: null,
      participants: [],
      witnesses: [],
      accountAddress,
      type: options[0]
    },
    constraints: {
      file: {
        presence: true
      }
    }
  })

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmiting(true)
      console.log(errors)
      const res = await createOrer({
        participants: formData.participants,
        witnesess: formData.witnesses,
        documentType: formData.type,
        accountAddress: formData.accountAddress,
        file: formData.file
      })
      console.log(res)
      navigate('/participant')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmiting(false)
    }
  }, [formData])

  const handleAddWitness = useCallback(() => {
    setFormField('witnesses', [...formData.witnesses, newAddress])
    setNewAddress('')
    setShowAddWitness(false)
  }, [formData, newAddress])

  const handleAddParticipant = useCallback(() => {
    setFormField('participants', [...formData.participants, newAddress])
    setNewAddress('')
    setShowAddParticipant(false)
  }, [formData, newAddress])

  const handleRemoveWitness = useCallback(
    (witness) => {
      setFormField(
        'witnesses',
        formData.witnesses.filter((w) => w !== witness)
      )
    },
    [formData]
  )

  const handleRemoveParticipants = useCallback(
    (participant) => {
      setFormField(
        'participants',
        formData.participants.filter((w) => w !== participant)
      )
    },
    [formData]
  )
  return (
    <div className="grid">
      <h1>Create order</h1>
      <div className="col-12">
        <div className="text-lg text-300 mb-4">Document</div>
        <Dropdown
          options={options}
          value={formData.type}
          onChange={(e) => {
            setFormField('type', e.value)
          }}
          className="mb-4"
        />
        <FileUpload
          label="Document PDF"
          error={errors?.file}
          accept=".pdf"
          onFileChange={(e) => setFormField('file', e[0])}
          disabled={isSubmiting}
        />
      </div>

      <div className="col-12">
        <div className="text-lg text-300 mb-4">Participants</div>
        {formData.participants.map((w) => {
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
        {formData.participants.length === 0 && (
          <div className="text-sm text-100 mb-4">No participants yet</div>
        )}
        <Button
          label="Add participant"
          className="mb-4"
          onClick={() => setShowAddParticipant(true)}
        />
      </div>

      <div className="col-12">
        <div className="text-lg text-300 mb-4">Witnesses</div>
        {formData.witnesses.map((w) => {
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
        {formData.witnesses.length === 0 && (
          <div className="text-sm text-100 mb-4">No witnesses yet</div>
        )}
        <Button
          label="Add witness"
          onClick={() => setShowAddWitness(true)}
          className="mb-2"
        />
      </div>
      <Button
        label="Save"
        onClick={(e) => submit(handleSubmit, e)}
        disabled={!canSubmit}
      />
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
        onHide={() => setShowAddParticipant(false)}
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
