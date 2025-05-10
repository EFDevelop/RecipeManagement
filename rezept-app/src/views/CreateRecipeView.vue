<template>
  <div class="create-recipe-view">
    <h2>Rezept erstellen</h2>
    <RecipeForm @recipe-created="handleRecipeCreated" />
  </div>
</template>

<script setup lang="js">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RecipeForm from '../components/RecipeForm.vue'
import { useRecipeStore } from '../composables/useRecipeStore.js'

const router = useRouter()
const { addRecipe, loadRecipes } = useRecipeStore()

// Beim Laden der Seite die bestehenden Rezepte ins Store laden
onMounted(() => {
  loadRecipes()
})

// Beim Erstellen eines neuen Rezepts: Persistieren und zurück zur Liste
const handleRecipeCreated = async (newRecipe) => {
  console.log('🔥 handleRecipeCreated called with:', newRecipe)
  try {
    await addRecipe(newRecipe)
    router.push({ name: 'RecipeList' })
  } catch (error) {
    console.error('Fehler beim Speichern des Rezepts:', error)
    // Hier ggf. Benutzer-Feedback ergänzen
  }
}
</script>

<style scoped>
.create-recipe-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
h2 {
  margin-bottom: 1rem;
  text-align: center;
}
</style>
