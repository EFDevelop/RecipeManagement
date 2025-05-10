<template>
  <div>
    <h1>Rezepte</h1>

    <!-- Suche -->
    <input
      v-model="localSearch"
      @input="onSearchInput"
      placeholder="Suche nach Rezepten"
      class="search-bar"
    />

    <div v-if="loading" class="loading">Lade Rezepte...</div>
    <div v-else-if="error" class="error">Fehler: {{ error.message }}</div>
    <div v-else>
      <div class="grid">
        <div
          v-for="recipe in paginatedItems"
          :key="recipe.id"
          class="recipe-container"
        >
          <RecipeCard
            :title="recipe.title"
            :description="recipe.description"
            :time="recipe.time"
            :rating="recipe.rating"
            :image="recipe.image"
            @show-details="goToDetail(recipe.id)"
          />
          <button @click="toggleFavorite(recipe.id)">
            {{ favoritesStore.isFavorite(recipe.id) ? '★ Favorit' : '☆ Favorit' }}
          </button>
        </div>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">← Zurück</button>
        <span>Seite {{ currentPage }} von {{ pageCount }}</span>
        <button @click="nextPage" :disabled="currentPage === pageCount">Weiter →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import RecipeCard from './RecipeCard.vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../composables/useFavoritesStore.js'
import { usePagination } from '../composables/usePagination.js'
import { useAsync } from '../composables/useAsync.js'
import { useRecipeStore } from '../composables/useRecipeStore.js'

const favoritesStore = useFavoritesStore()
const recipeStore    = useRecipeStore()
const router         = useRouter()

// Suche mit Debounce im Store
const localSearch = ref(recipeStore.searchQuery)
watch(localSearch, q => {
  recipeStore.setSearchQuery(q)
})

// Pagination auf die gefilterten Rezepte
const {
  currentPage,
  pageCount,
  paginatedItems,
  nextPage,
  prevPage
} = usePagination(recipeStore.filteredRecipes, 5)

// Async-Lade-Wrapper für initiales Laden
const { loading, error, execute: loadRecipes } = useAsync(async () => {
  await recipeStore.loadRecipes()
})

onMounted(() => {
  loadRecipes()
})

// Navigation
const goToDetail = id => router.push(`/recipe/${id}`)

// Favoriten umschalten
function toggleFavorite(id) {
  if (favoritesStore.isFavorite(id)) {
    favoritesStore.removeFavorite(id)
  } else {
    favoritesStore.addFavorite(id)
  }
}

// Leerfunktion, weil watch den Search-Abruf übernimmt
function onSearchInput() {}
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}

.loading {
  font-style: italic;
  margin: 1rem 0;
}

.error {
  color: red;
  margin: 1rem 0;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.recipe-container {
  border: 1px solid #ccc;
  padding: 1rem;
  width: 300px;
}

button {
  margin: 0.5rem 0;
  background-color: #ffd700;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  width: 120px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
}

.pagination span {
  font-weight: bold;
}
</style>
