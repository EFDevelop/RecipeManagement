// src/composables/useRecipeStore.js
import { reactive, readonly, ref, computed } from 'vue'

// Reaktives State-Objekt für Rezepte
const state = reactive({ recipes: [] })

// Such- und Filter-State
const searchQuery = ref('')          // Nutzer-Eingabe für Live-Suche
const debouncedQuery = ref('')       // Debounced-Version der Suche zum Performancetuning
let debounceTimeout = null           // Timer-Handle für Debounce

// Filter- und Sort-State
const filters = reactive({
  category: '',
  difficulty: '',
  timeMin: null,
  timeMax: null,
  ratingMin: null,
  ratingMax: null
})
const sortOption = ref('relevance')  // Aktuelle Sortieroption

/**
 * Setzt die Suchanfrage und aktualisiert debouncedQuery mit Verzögerung (300ms).
 * @param {string} q - Suchbegriff
 */
export function setSearchQuery(q) {
  searchQuery.value = q
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedQuery.value = q.trim().toLowerCase()
  }, 300)
}

/**
 * Setzt einen Filterwert.
 * @param {string} key - Filtername
 * @param {*} value - Filterwert
 */
export function setFilter(key, value) {
  if (filters.hasOwnProperty(key)) filters[key] = value
}

/**
 * Setzt die Sortieroption.
 * @param {string} option - e.g. 'timeAsc', 'ratingDesc'
 */
export function setSortOption(option) {
  sortOption.value = option
}

// Computed: gefilterte und sortierte Rezepte basierend auf searchQuery, filters, sortOption
const filteredRecipes = computed(() => {
  let list = state.recipes.slice()

  // Textsuche
  if (debouncedQuery.value) {
    list = list.filter(r =>
      r.title.toLowerCase().includes(debouncedQuery.value) ||
      r.description.toLowerCase().includes(debouncedQuery.value)
    )
  }

  // Filteroptionen anwenden
  if (filters.category)    list = list.filter(r => r.category === filters.category)
  if (filters.difficulty)  list = list.filter(r => r.difficulty === filters.difficulty)
  if (filters.timeMin != null) list = list.filter(r => r.time >= filters.timeMin)
  if (filters.timeMax != null) list = list.filter(r => r.time <= filters.timeMax)
  if (filters.ratingMin != null) list = list.filter(r => r.rating >= filters.ratingMin)
  if (filters.ratingMax != null) list = list.filter(r => r.rating <= filters.ratingMax)

  // Sortierung
  switch (sortOption.value) {
    case 'timeAsc':    list.sort((a,b) => a.time - b.time); break
    case 'timeDesc':   list.sort((a,b) => b.time - a.time); break
    case 'ratingAsc':  list.sort((a,b) => a.rating - b.rating); break
    case 'ratingDesc': list.sort((a,b) => b.rating - a.rating); break
    case 'dateAsc':    list.sort((a,b) => new Date(a.date) - new Date(b.date)); break
    case 'dateDesc':   list.sort((a,b) => new Date(b.date) - new Date(a.date)); break
    // 'relevance' bzw. default: keine zusätzliche Sortierung
  }

  return list
})

// Computed: Durchschnittliche Bewertung aller Rezepte
const averageRating = computed(() => {
  const rated = state.recipes.filter(r => r.rating != null)
  if (rated.length === 0) return 0
  const total = rated.reduce((sum, r) => sum + Number(r.rating), 0)
  return (total / rated.length).toFixed(2)
})

// Computed: Top 3 bewertete Rezepte
const topRatedRecipes = computed(() => {
  return [...state.recipes]
    .filter(r => r.rating != null)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
})

// CRUD-Operationen

/**
 * Lädt alle Rezepte vom JSON-Server.
 */
export async function loadRecipes() {
  try {
    const res = await fetch('http://localhost:3000/recipes')
    state.recipes = await res.json()
  } catch (err) {
    console.error('Fehler beim Laden der Rezepte:', err)
  }
}

/**
 * Fügt ein neues Rezept hinzu.
 * @param {Object} recipe - Rezeptobjekt
 * @returns {Object} hinzugefügtes Rezept
 */
export async function addRecipe(recipe) {
  try {
    const res = await fetch('http://localhost:3000/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    })
    const added = await res.json()
    state.recipes.push(added)
    return added
  } catch (err) {
    console.error('Fehler beim Hinzufügen des Rezepts:', err)
    throw err
  }
}

/**
 * Aktualisiert ein bestehendes Rezept.
 * @param {Object} updated - aktualisiertes Rezeptobjekt
 * @returns {Object}
 */
export async function updateRecipe(updated) {
  try {
    const res = await fetch(`http://localhost:3000/recipes/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    const data = await res.json()
    const index = state.recipes.findIndex(r => r.id === updated.id)
    if (index !== -1) state.recipes[index] = data
    return data
  } catch (err) {
    console.error('Fehler beim Aktualisieren des Rezepts:', err)
    throw err
  }
}

/**
 * Löscht ein Rezept anhand der ID.
 * @param {string|number} id
 */
export async function deleteRecipe(id) {
  try {
    await fetch(`http://localhost:3000/recipes/${id}`, { method: 'DELETE' })
    state.recipes = state.recipes.filter(r => r.id !== id)
  } catch (err) {
    console.error('Fehler beim Löschen des Rezepts:', err)
    throw err
  }
}

// Export eines Singleton-Store-Objekts
export const recipeStore = {
  state: readonly(state),
  filteredRecipes,
  loadRecipes,
  addRecipe,
  searchQuery,
  filters,
  sortOption,
  setSearchQuery,
  setFilter,
  setSortOption,
  averageRating,
  topRatedRecipes
}

/**
 * Composition API Hook: Zugriff auf den recipeStore.
 */
export function useRecipeStore() {
  return recipeStore
}
