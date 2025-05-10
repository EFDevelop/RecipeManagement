<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Rezeptverwaltung</h1>
    <!-- Anzeige, wenn keine Rezepte vorhanden -->
    <div v-if="recipes.length === 0" class="text-gray-500">Keine Rezepte gefunden.</div>
    <!-- Tabelle mit allen Rezepten -->
    <table v-else class="min-w-full table-auto">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left">Rezeptname</th>
          <th class="px-4 py-2 text-left">Kategorie</th>
          <th class="px-4 py-2 text-left">Bewertung</th>
          <th class="px-4 py-2 text-left">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        <!-- Jede Rezept-Zeile -->
        <tr v-for="recipe in recipes" :key="recipe.id" class="border-b">
          <!-- Titel des Rezepts -->
          <td class="px-4 py-2">{{ recipe.title }}</td>
          <!-- Kategorie des Rezepts -->
          <td class="px-4 py-2">{{ recipe.category }}</td>
          <!-- Bewertung, alternativ Platzhalter -->
          <td class="px-4 py-2">
            {{ recipe.rating != null ? recipe.rating : 'Keine Bewertung' }}
          </td>
          <!-- Löschen-Button -->
          <td class="px-4 py-2">
            <button
              @click="deleteRecipe(recipe.id)"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Löschen
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="js">
// Composition API: Reaktive Referenz für das Rezepte-Array
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Initial leer, gefüllt durch onMounted
const recipes = ref([])

// Laden der Rezepte beim Mounten der Komponente
onMounted(async () => {
  try {
    // HTTP-GET an json-server
    const response = await axios.get('http://localhost:3000/recipes')
    recipes.value = response.data // Daten im referenzierten Array speichern
  } catch (err) {
    console.error('Fehler beim Laden der Rezepte:', err)
  }
})

/**
 * Löscht ein Rezept anhand seiner ID.
 * Fragt vorher eine Bestätigung ab.
 * Anschließend wird die Liste aktualisiert.
 * @param {string|number} recipeId
 */
const deleteRecipe = async (recipeId) => {
  if (confirm('Möchten Sie dieses Rezept wirklich löschen?')) {
    try {
      // HTTP-DELETE am json-server
      await axios.delete(`http://localhost:3000/recipes/${recipeId}`)
      // Lokale Liste aktualisieren
      recipes.value = recipes.value.filter(r => r.id !== recipeId)
    } catch (err) {
      console.error('Fehler beim Löschen des Rezepts:', err)
    }
  }
}
</script>

<style scoped>
/* Hover-Effekt für Löschen-Button */
button:hover {
  background-color: #f56565;
}
</style>
