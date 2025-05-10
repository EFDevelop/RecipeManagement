import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const data = ref(stored ? JSON.parse(stored) : defaultValue)

  watch(data, (newVal) => {
    try {
      localStorage.setItem(key, JSON.stringify(newVal))
    } catch (e) {
      console.warn('LocalStorage nicht verfügbar', e)
    }
  }, { deep: true })

  return data
}