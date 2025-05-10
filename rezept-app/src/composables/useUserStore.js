// src/composables/useUserStore.js
import { reactive } from 'vue'
import { favoritesStore } from './useFavoritesStore.js'

const store = reactive({
  user: null,
  isLoggedIn: false,

  // Initialisiert Benutzer aus LocalStorage
  initializeUser() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        store.user = {
          id: user.id,
          username: user.username,
          role: user.role || 'user' // Fallback für alte Einträge
        }
        store.isLoggedIn = true

        favoritesStore.setUserIdGetter(() => store.user.id)
        favoritesStore.loadFavoritesFromBackend()

        console.log('Benutzer aus LocalStorage geladen:', store.user)
      } catch (e) {
        console.error('Fehler beim Parsen von Benutzerdaten aus LocalStorage:', e)
        store.user = null
        store.isLoggedIn = false
      }
    } else {
      console.log('Kein Benutzer im LocalStorage gefunden.')
    }
  },

  // Login
  async login(username, password) {
    try {
      const res = await fetch(
        `http://localhost:3000/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      )
      if (!res.ok) throw new Error()
      const users = await res.json()
      if (users.length === 0) throw new Error()

      store.user = {
        id: users[0].id,
        username: users[0].username,
        role: users[0].role || 'user'
      }
      store.isLoggedIn = true

      favoritesStore.setUserIdGetter(() => store.user.id)
      await favoritesStore.loadFavoritesFromBackend()

      localStorage.setItem('user', JSON.stringify(store.user))
      return true
    } catch (error) {
      console.warn('Login fehlgeschlagen:', error)
      store.user = null
      store.isLoggedIn = false
      return false
    }
  },

  // Logout
  logout() {
    store.user = null
    store.isLoggedIn = false
    favoritesStore.loadFavorites([])

    localStorage.removeItem('user')
  },

  // Profil aktualisieren
  updateProfile(updatedData) {
    if (store.isLoggedIn && store.user) {
      store.user = { ...store.user, ...updatedData }
      localStorage.setItem('user', JSON.stringify(store.user))
    }
  }
})

export const userStore = store

export function useUserStore() {
  return userStore
}
