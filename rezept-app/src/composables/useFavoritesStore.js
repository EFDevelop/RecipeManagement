import { ref } from 'vue'

// Reaktives Array zur Speicherung der Favoriten-IDs
const favorites = ref([])

// Funktion, um die aktuelle Benutzer-ID zu ermitteln (wird später via setUserIdGetter gesetzt)
let getUserId = () => null

/**
 * Ermöglicht es, eine Funktion zu registrieren, die die aktuelle Benutzer-ID liefert.
 * @param {Function} fn - Callback, der die User-ID zurückgibt
 */
export function setUserIdGetter(fn) {
  getUserId = fn
}

/**
 * Speichert die Favoriten-Liste im Backend (json-server) für den aktuellen Benutzer.
 * Wird nach jeder Änderung ausgelöst.
 */
async function persistFavorites() {
  const userId = getUserId()
  if (!userId) return // Keine Speicherung, wenn keine User-ID vorhanden

  try {
    await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorites: favorites.value })
    })
  } catch (err) {
    console.error('Fehler beim Speichern der Favoriten:', err)
  }
}

/**
 * Lädt die Favoriten für den aktuellen Benutzer aus dem Backend.
 * Aktualisiert das lokale favorites-Array.
 */
async function loadFavoritesFromBackend() {
  const userId = getUserId()
  if (!userId) return

  try {
    const res = await fetch(`http://localhost:3000/users/${userId}`)
    if (!res.ok) throw new Error('Fetch fehlgeschlagen')
    const userData = await res.json()
    favorites.value = Array.isArray(userData.favorites) ? userData.favorites : []
  } catch {
    favorites.value = [] // Fallback auf leeres Array
  }
}

/**
 * Initial lädt Favoriten aus übergebenem Array (z.B. aus localStorage oder Initialdaten).
 * @param {Array} userFavorites
 */
function loadFavorites(userFavorites = []) {
  favorites.value = userFavorites
}

/**
 * Fügt eine Rezept-ID zu den Favoriten hinzu und persistiert.
 * @param {string} recipeId
 */
function addFavorite(recipeId) {
  if (!favorites.value.includes(recipeId)) {
    favorites.value.push(recipeId)
    persistFavorites()
  }
}

/**
 * Entfernt eine Rezept-ID aus den Favoriten und persistiert.
 * @param {string} recipeId
 */
function removeFavorite(recipeId) {
  favorites.value = favorites.value.filter(id => id !== recipeId)
  persistFavorites()
}

/**
 * Toggle-Funktion: Wenn Favorit vorhanden, entfernen; sonst hinzufügen.
 * @param {string} recipeId
 */
function toggleFavorite(recipeId) {
  favorites.value.includes(recipeId)
    ? removeFavorite(recipeId)
    : addFavorite(recipeId)
}

/**
 * Prüft, ob eine Rezept-ID in den Favoriten enthalten ist.
 * @param {string} recipeId
 * @returns {boolean}
 */
function isFavorite(recipeId) {
  return favorites.value.includes(recipeId)
}

// Singleton-Store mit allen Methoden und dem reactive favorites-Array
export const favoritesStore = {
  favorites,
  loadFavorites,
  loadFavoritesFromBackend,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  isFavorite,
  setUserIdGetter
}

// Optionaler Alias-Hook für Composition API
export function useFavoritesStore() {
  return favoritesStore
}
