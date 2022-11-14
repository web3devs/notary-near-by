import { Button } from 'primereact'
import { useAuth } from '../context/AuthProvider'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from 'primereact/card';
import Logo from '../assets/logo.svg'

export default () => {
  const { isConnected, login, setRole } = useAuth()
  const navigate = useNavigate()

  const icon = (icon, label) => (
    <Button icon={`pi ${icon}`} className="p-button-rounded" aria-label={label} />
  )

  const cta = (callback, label) => {
    return (<Button label={label} icon="pi pi-arrow-right" onClick={callback} className="p-button-text pl-0 pr-0" iconPos="right" style={{ width: '100%', textAlign: 'justify'}} />)
  }

  const imParticipant = () => { setRole('participant'); navigate('/participant') }
  const imNotary = () => { setRole('notary'); navigate('/notary') }
  const imWitness = () => { setRole('witness'); navigate('/participant') }

  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <div className="w-7 flex flex-column justify-content-center align-items-center">
        <Link to="/"><img src={Logo} alt="Homepage" /></Link>
        <h1 className="home-welcome">Welcome to <span className="text-primary">NEAR Notary</span></h1>
        <div className="home-welcome-text">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. </div>

        {isConnected && (
          <div className="mt-6 flex gap-3">
            <Card onClick={imParticipant} title={icon('pi-user', 'Participant')} style={{ width: '15em', cursor: 'pointer' }} footer={cta(imParticipant, 'Participant')} className="bg-white"  />
            <Card onClick={imNotary} title={icon('pi-user', 'Participant')} style={{ width: '15em', cursor: 'pointer' }} footer={cta(imNotary, 'Notary')} className="bg-white" />
            <Card onClick={imWitness} title={icon('pi-user', 'Participant')} style={{ width: '15em', cursor: 'pointer' }} footer={cta(imWitness, 'Witness')} className="bg-white" />
          </div>
        )}

        {!isConnected && (
          <Button
            label="Connect wallet"
            className="p-button-primary mt-6"
            onClick={() => {
              login()
            }}
          />
        )}
      </div>
    </div>
  )
}
