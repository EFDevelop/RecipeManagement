import { reactive, toRefs } from 'vue'

/**
 * useForm hook with robust field initialization
 * @param {Object} initialFields - initial form values
 * @param {Object} validationRules - validation rules per field
 */
export function useForm(initialFields = {}, validationRules = {}) {
  // Merge initial fields and ensure all validation keys exist
  const fieldsObj = { ...initialFields }
  for (const key in validationRules) {
    if (!(key in fieldsObj)) {
      // Initialize missing fields to empty array if rule name suggests array (e.g. ingredients, instructions), else empty string
      if (key === 'ingredients' || key === 'instructions') {
        fieldsObj[key] = []
      } else {
        fieldsObj[key] = ''
      }
    }
  }

  const form = reactive({
    fields: fieldsObj,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false
  })

  const validateField = async (fieldName) => {
    const value = form.fields[fieldName]
    const rules = validationRules[fieldName] || []

    for (const rule of rules) {
      const error = await rule(value)
      if (error) {
        form.errors[fieldName] = error
        return false
      }
    }

    form.errors[fieldName] = ''
    return true
  }

  const validateForm = async () => {
    let valid = true
    for (const field in validationRules) {
      const fieldValid = await validateField(field)
      if (!fieldValid) valid = false
    }
    form.isValid = valid
    return valid
  }

  const handleSubmit = async (callback) => {
    form.isSubmitting = true
    const isValid = await validateForm()

    if (isValid) {
      await callback({ ...form.fields })
    }

    form.isSubmitting = false
  }

  return {
    ...toRefs(form),
    validateField,
    validateForm,
    handleSubmit
  }
}
