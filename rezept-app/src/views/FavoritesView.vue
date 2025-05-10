<script setup>
import { useFavoritesStore } from '../composables/useFavoritesStore'
import { ref, onMounted, watch } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'
import { useRouter } from 'vue-router'

const favoritesStore = useFavoritesStore()
const favoriteRecipes = ref([])
const router = useRouter()

//Rezepte laden
async function loadFavoriteRecipes() {
  const res = await fetch('http://localhost:3000/recipes')
  const allRecipes = await res.json()

  const currentFavorites = Array.isArray(favoritesStore.favorites.value)
    ? favoritesStore.favorites.value
    : []

  console.log("Aktuelle Favoriten-IDs:", currentFavorites)

  favoriteRecipes.value = allRecipes.filter(r =>
    currentFavorites.includes(r.id)
  )
}

onMounted(() => {
  loadFavoriteRecipes()
})

// Wenn sich die Favoriten ändern, neu laden:
watch(() => favoritesStore.favorites.value, loadFavoriteRecipes, { deep: true })

// Routenwechsel zur Detailseite
const goToDetail = (id) => {
  router.push(`/recipe/${id}`)
}

// Favorit entfernen
const toggleFavorite = (id) => {
  favoritesStore.removeFavorite(id)
}
</script>

<template>
  <div>
    <h1>⭐ Meine Favoriten</h1>

    <div v-if="Array.isArray(favoritesStore.favorites.value)">
      <div v-if="favoriteRecipes.length === 0">
        <p>Du hast noch keine Favoriten gespeichert.</p>
      </div>

      <div v-else class="grid">
        <RecipeCard
          v-for="recipe in favoriteRecipes"
          :key="recipe.id"
          :title="recipe.title"
          :description="recipe.description"
          :image="recipe.image"
          :time="recipe.time"
          :rating="recipe.rating"
          :isFavorite="true"
          @show-details="goToDetail(recipe.id)"
          @toggle-favorite="() => toggleFavorite(recipe.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
</style>