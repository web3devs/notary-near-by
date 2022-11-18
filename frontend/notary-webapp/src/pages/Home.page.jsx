import { useEffect, useState } from 'react'
import { Button } from 'primereact'
import { useAuth } from '../context/AuthProvider'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from 'primereact/card';
import Logo from '../assets/logo.svg'
import { getParticipantProfile, getNotaryProfile } from '../api'

export default () => {
  const [participant, setParticipant] = useState(null)
  const [notary, setNotary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, login, setRole, accountAddress } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    ; (async () => {
      if (isConnected) {
        setIsLoading(true)
        try {
          const p = await getParticipantProfile(accountAddress)
          setParticipant({...p})
        } catch (e) {
          console.log(e)
          if (e.response.status === 404) {
            setParticipant(null)
          }
        } finally {
          setIsLoading(false)
        }
      }
    })()
  }, [isConnected])

  useEffect(() => {
    ; (async () => {
      if (isConnected) {
        setIsLoading(true)
        try {
          const n = await getNotaryProfile(accountAddress)
          setNotary({ ...n })
        } catch (e) {
          console.log(e)
          if (e.response.status === 404) {
            setNotary(null)
          }
        } finally {
          setIsLoading(false)
        }
      }
    })()
  }, [isConnected])

  const icon = (icon, label) => (
    <Button icon={`pi ${icon}`} className="p-button-rounded" aria-label={label} />
  )

  const cta = (callback, label) => {
    return (<Button label={label} icon="pi pi-arrow-right" onClick={callback} className="p-button-text pl-0 pr-0" iconPos="right" style={{ width: '100%', textAlign: 'justify'}} />)
  }

  const imParticipant = () => {
    setRole('participant')
    if (participant) return navigate('/participant')

    return navigate('/participant/sign-up')
  }
  const imNotary = () => {
    setRole('notary')
    if (notary) return navigate('/notary')

    return navigate('/notary/sign-up')
  }

  const imWitness = () => {
    setRole('witness')

    if (participant) return navigate('/participant')

    return navigate('/participant/sign-up')
  }

  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <div className="w-7 flex flex-column justify-content-center align-items-center">
        <Link to="/"><img src={Logo} alt="Homepage" style={{ width: '100px' }} /></Link>
        <h1 className="home-welcome">Welcome to <span className="text-primary">NEAR Notary</span></h1>
        <div className="home-welcome-text">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. </div>

        {isConnected && (
          <div className="mt-6 flex gap-3">
            <Card onClick={imParticipant} title={icon('pi-user', 'Participant')} style={{ width: '15em', cursor: 'pointer' }} footer={cta(imParticipant, 'Participant')} className="bg-white"  />
            <Card onClick={imNotary} title={icon('pi-user-edit', 'Participant')} style={{ width: '15em', cursor: 'pointer' }} footer={cta(imNotary, 'Notary')} className="bg-white" />
            <Card onClick={imWitness} title={icon('pi-eye', 'Participant')} style={{ width: '15em', cursor: 'pointer' }} footer={cta(imWitness, 'Witness')} className="bg-white" />
          </div>
        )}

        {!isConnected && (
          <Button
            label="Connect wallet"
            className="p-button-primary mt-6"
            onClick={() => {
              setIsLoading(true)
              login()
            }}
          />
        )}
      </div>
    </div>
  )
}
