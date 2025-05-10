<template>
  <div id="app">
    <nav class="nav">
      <router-link to="/">📋 Alle Rezepte</router-link>
      <router-link to="/favoriten">⭐ Favoriten</router-link>
      <router-link to="/create">✏️ Rezept erstellen</router-link>
      <router-link to="/profile">👤 Profil</router-link>

      <!-- Dashboard-Button nur für Admins und Premium-Benutzer sichtbar -->
      <router-link v-if="isAdminOrPremium" to="/dashboard">📊 Dashboard</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { userStore } from './composables/useUserStore'
import { favoritesStore } from './composables/useFavoritesStore'
import { recipeStore } from './composables/useRecipeStore'
import './assets/main.scss'
onMounted(() => {
  userStore.initializeUser()

  if (userStore.isLoggedIn) {
    favoritesStore.loadFavoritesFromBackend()
  }

  recipeStore.loadRecipes()
})
// Korrekte reaktive Referenzen
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)

// Initialisierung im Lifecycle


// Nur Admin oder Premium sehen Dashboard
const isAdminOrPremium = computed(() => {
  return user.value?.role === 'admin' || user.value?.role === 'premium'
})

// Debugging
console.log('Aktueller User:', user.value)
console.log(localStorage.getItem('user'))
</script>


<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ccc;
}
.nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}
.nav a.router-link-exact-active {
  color: #007bff;
}
</style>
