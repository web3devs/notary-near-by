import { Button } from 'primereact'
import './ListItem.scss'
export default ({ data: { document_type, owner, status, created_at }, onClick }) => {
  return (
    <div className="dash-list-item flex justify-space-between w-full p-2 mb-2">
      <div className="flex-grow-1 flex flex-column">
        <div className="text-xl text-whites">{owner} / {created_at}</div>
        <div className="text-sm text-100">{document_type}</div>
      </div>
      <Button
        label="join"
        disabled={status === 'open'}
        className="pl-4 pr-4"
        onClick={onClick}
      />
    </div>
  )
}
