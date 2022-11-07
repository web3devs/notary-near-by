import React, { useEffect, useState, useCallback, useMemo } from 'react'
import validate from 'validate.js'

const useForm = ({ constraints, data }) => {
  const [errors, setErrors] = useState()
  const [isTouched, setIsTouched] = useState(false)
  const [initFormData, setInitFormData] = useState(data)
  const [formData, setFormData] = useState(data)
  const [formDirty, setFormDirty] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    setFormData(initFormData)
  }, [initFormData])

  useEffect(() => {
    if (!isTouched) {
      return
    }
    const e = validate(formData, constraints)
    const valid = e === undefined
    setIsFormValid(valid)
    setErrors(e)
  }, [JSON.stringify(formData), isTouched, JSON.stringify(constraints)])

  useEffect(() => {
    if (JSON.stringify(initFormData) === JSON.stringify(formData)) {
      setFormDirty(false)
    } else {
      setFormDirty(true)
    }
  }, [formData, initFormData])

  const setFormField = (fieldName, value) => {
    console.log(formData)
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const resetForm = useCallback(() => {
    setFormData(initFormData)
  }, [initFormData])

  const submit = useCallback(
    (onSubmit, ev) => {
      ev.preventDefault()
      console.log('is touched')
      if (!isTouched) {
        setIsTouched(true)
        return
      }
      if (!isFormValid) {
        return
      }
      onSubmit?.()
    },
    [isTouched, isFormValid]
  )

  const canSubmit = useMemo(() => {
    if (!isTouched) {
      return true
    }
    return isFormValid
  }, [isTouched, isFormValid])

  return {
    formData,
    formDirty,
    setInitFormData,
    setFormData,
    setFormField,
    resetForm,
    errors,
    isFormValid,
    isTouched,
    submit,
    canSubmit
  }
}

export default useForm
