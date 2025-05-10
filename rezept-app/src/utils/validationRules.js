export const required = (fieldName = 'Feld') => (value) =>
    !value ? `${fieldName} ist erforderlich.` : ''
  
  export const minLength = (min) => (value) =>
    value.length < min ? `Mindestlänge ist ${min} Zeichen.` : ''
  
  export const isArrayWithValues = (value) =>
    !Array.isArray(value) || value.length === 0
      ? 'Mindestens ein Eintrag erforderlich.'
      : ''
  
  export const isPositiveNumber = (value) =>
    value === null || value === undefined || isNaN(value) || Number(value) <= 0
      ? 'Bitte eine positive Zahl eingeben.'
      : ''
  
  export const isUniqueTitle = async (value) => {
    try {
      const response = await fetch(
        'http://localhost:3000/recipes?title=' + encodeURIComponent(value)
      )
      const data = await response.json()
      return data.length > 0 ? 'Titel ist bereits vergeben.' : ''
    } catch (error) {
      console.error('Fehler bei der Validierung des Titels:', error)
      return 'Titel konnte nicht validiert werden.'
    }
  }