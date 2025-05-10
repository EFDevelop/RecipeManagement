import { ref } from 'vue'

/**
 * useAsync: Verwaltung von asynchronen Operationen
 * @param {Function} asyncFn - Eine Funktion, die ein Promise zurückgibt
 * @param  {...any} params - Optionale Parameter für den Aufruf
 * @returns {Object} { data, error, loading, execute }
 */
export function useAsync(asyncFn, ...params) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const execute = async (...args) => {
    loading.value = true
    error.value = null
    try {
      const result = await asyncFn(...params, ...args)
      data.value = result
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // Optional: direkt ausführen
  // execute()

  return {
    data,
    error,
    loading,
    execute
  }
}
