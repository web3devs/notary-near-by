import { Button, InputNumber, ProgressSpinner } from 'primereact'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default () => {
  const [isMinting, setIsMinting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fee, setFee] = useState(null)
  const [timer, setTimer] = useState(5)
  const navigate = useNavigate()
  const isValid = useMemo(() => {
    return !(fee && fee > 0)
  }, [fee])
  const handleSubmit = () => {
    setIsMinting(true)
    setTimeout(() => {
      setIsMinting(false)
      setIsSubmitted(true)
    }, 3000)
  }

  useEffect(() => {
    if (isSubmitted) {
      setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1
          if (newTime === 0) {
            navigate('/participant')
          }
          return newTime
        })
      }, 1000)
    }
  }, [isSubmitted])
  if (isSubmitted) {
    return (
      <div className="flex flex-column justify-content-center align-items-center">
        <div style={{ fontSize: '32px' }}>
          <i
            className="pi pi-check"
            style={{ fontSize: '2em', color: 'green' }}
          ></i>
        </div>
        <div className="text-sm">
          You should receive a confirmation of the order in the metamask
        </div>

        <div className="text-xs">
          <span>You will be redirected to orders list in </span>
          <span>{` ${timer} seconds`}</span>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-column justify-content-center align-items-center">
      {isMinting ? (
        <>
          <ProgressSpinner className="mb-4" />
          <div>Minting the receipt</div>
        </>
      ) : (
        <>
          <div className="text-center mb-2">Get the receipt</div>
          <div className="text-xs align-self-start">Fee:</div>
          <InputNumber
            value={fee}
            onChange={(e) => {
              setFee(e.value)
            }}
            className="text-center mb-4"
          />
          <Button
            disabled={isValid}
            label="Mint"
            className="w-6"
            onClick={handleSubmit}
          />
        </>
      )}
    </div>
  )
}
