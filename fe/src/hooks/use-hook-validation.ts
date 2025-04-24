'use client'

//path : fe/src/hooks/use-hook-validation.ts
import type React from 'react'
import { useState } from 'react'

type ValidationRule = {
  validator: (value: any) => boolean
  message: string
}

type FieldRules = {
  [key: string]: ValidationRule[]
}

export function useFormValidation<T extends Record<string, any>>(initialValues: T, rules: FieldRules) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Trim the value if it's a string
    const processedValue = typeof value === 'string' ? value.trim() : value

    setValues({
      ...values,
      [name]: processedValue,
    })

    // Validate the field if it has been touched
    if (touched[name]) {
      validateField(name, processedValue)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setTouched({
      ...touched,
      [name]: true,
    })

    validateField(name, value)
  }

  const validateField = (name: string, value: any) => {
    if (!rules[name]) return

    for (const rule of rules[name]) {
      if (!rule.validator(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: rule.message,
        }))
        return
      }
    }

    // Clear error if validation passes
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    Object.keys(rules).forEach((key) => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    // Validate all fields
    Object.entries(rules).forEach(([fieldName, fieldRules]) => {
      const value = values[fieldName]

      for (const rule of fieldRules) {
        if (!rule.validator(value)) {
          newErrors[fieldName] = rule.message
          isValid = false
          break
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setValues,
  }
}
