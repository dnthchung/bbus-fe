/**
 * Utility functions for form validation
 */
//path : fe/src/features/students/data/validations.ts
// Trims spaces from the beginning and end of a string
export const trimValue = (value: string): string => {
  return value.trim()
}

// Validates a phone number (must be 10 digits and start with 0)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^0\d{9}$/
  return phoneRegex.test(phone)
}

// Validates an email address using a comprehensive regex pattern
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// Validates that a field is not empty after trimming
export const isNotEmpty = (value: string): boolean => {
  return trimValue(value).length > 0
}

// Generic input validation function
export const validateInput = (value: string, validators: Array<(val: string) => boolean>, errorMessages: string[]): string | null => {
  for (let i = 0; i < validators.length; i++) {
    if (!validators[i](value)) {
      return errorMessages[i]
    }
  }
  return null
}
