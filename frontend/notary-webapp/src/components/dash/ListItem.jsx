import { Button } from 'primereact'
import './ListItem.scss'
export default ({ data: { name, surrname, status, fileType } }) => {
  return (
    <div className="dash-list-item flex justify-space-between w-full p-2 mb-2">
      <div className="flex-grow-1 flex flex-column">
        <div className="text-xl text-whites">{name + ' ' + surrname}</div>
        <div className="text-sm text-100">{fileType}</div>
      </div>
      <Button label="join" disabled={status === 'open'} />
    </div>
  )
}
