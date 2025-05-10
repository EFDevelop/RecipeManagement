<template>
  <div v-if="recipe">
    <h1>{{ recipe.title }}</h1>
    <img :src="recipe.image" alt="Rezeptbild" class="recipe-image" />
    <p><strong>Beschreibung:</strong> {{ recipe.description }}</p>
    <p><strong>Zubereitungszeit:</strong> {{ recipe.time }} Minuten</p>
    <p><strong>Bewertung:</strong> {{ recipe.rating }} ⭐</p>

    <h2>Zutaten</h2>
    <ul>
      <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
        {{ ingredient }}
      </li>
    </ul>

    <h2>Anleitung</h2>
    <p>{{ recipe.instructions }}</p>

    <div class="button-group">
      <button @click="goToEdit">✏️ Bearbeiten</button>
      <button @click="deleteRecipe">🗑️ Löschen</button>
    </div>
  </div>

  <div v-else>
    <p>Rezept wird geladen...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const recipe = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/recipes/${route.params.id}`)
    if (!res.ok) throw new Error('Rezept nicht gefunden')
    recipe.value = await res.json()
  } catch (error) {
    console.error('Fehler beim Laden des Rezepts:', error)
  }
})

function goToEdit() {
  router.push(`/edit/${route.params.id}`) 
}

async function deleteRecipe() {
  if (!confirm('Willst du dieses Rezept wirklich löschen?')) return
  try {
    await fetch(`http://localhost:3000/recipes/${route.params.id}`, {
      method: 'DELETE'
    })
    router.push('/')  // Zurück zur Rezeptliste nach Löschen
  } catch (error) {
    console.error('Fehler beim Löschen:', error)
  }
}
</script>

<style scoped>
.recipe-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
}
.button-group {
  margin-top: 2rem;
}
button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #ff4d4d;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
button:first-of-type {
  background-color: #007bff;
}
</style>
