import { ref, watch } from 'vue'

/**
 * useDebounce: Debounced Reactive Value
 * @param {Ref<any>} value - das zu debouncende Reactive
 * @param {number} delay - Verzögerung in ms
 * @returns {Ref<any>} debouncedValue
 */
export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  let timeout

  watch(
    value,
    (newVal) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        debouncedValue.value = newVal
      }, delay)
    },
    { immediate: true }
  )

  return debouncedValue
}
