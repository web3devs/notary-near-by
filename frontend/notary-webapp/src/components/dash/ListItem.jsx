import { Button } from 'primereact'
import './ListItem.scss'
export default ({ data: { owner, status, fileType }, onClick }) => {
  return (
    <div className="dash-list-item flex justify-space-between w-full p-2 mb-2">
      <div className="flex-grow-1 flex flex-column">
        <div className="text-xl text-whites">{owner}</div>
        <div className="text-sm text-100">{fileType}</div>
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
