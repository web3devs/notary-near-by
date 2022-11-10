import React, { useEffect, useState, useCallback, useMemo } from 'react'
import validate from 'validate.js'
import moment from 'moment'

const useForm = ({ constraints, data }) => {
  const [errors, setErrors] = useState()
  const [initFormData, setInitFormData] = useState(data)
  const [formData, setFormData] = useState(data)
  const [formDirty, setFormDirty] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    validate.extend(validate.validators.datetime, {
      // The value is guaranteed not to be null or undefined but otherwise it
      // could be anything.
      parse: function(value, options) {
        return +moment.utc(value);
      },
      // Input is a unix timestamp
      format: function(value, options) {
        var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return moment.utc(value).format(format);
      }
    });

  },[])

  useEffect(() => {
    setFormData(initFormData)
  }, [initFormData])

  useEffect(() => {
    const e = validate(formData, constraints)
    const valid = e === undefined
    setIsFormValid(valid)
    setErrors(e)
  }, [JSON.stringify(formData), JSON.stringify(constraints)])

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

      if (!isFormValid) {
        return
      }

      onSubmit?.()
    },
    [isFormValid]
  )

  const canSubmit = useMemo(() => {
    return isFormValid
  }, [isFormValid])

  return {
    formData,
    formDirty,
    setInitFormData,
    setFormData,
    setFormField,
    resetForm,
    errors,
    isFormValid,
    submit,
    canSubmit
  }
}

export default useForm
