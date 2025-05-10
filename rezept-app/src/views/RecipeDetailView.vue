<template>
    <div v-if="recipe">
      <h1>{{ recipe.title }}</h1>
      <img :src="recipe.image" alt="Rezeptbild" style="max-width: 100%; height: auto;" />
      <p><strong>Zubereitungszeit:</strong> {{ recipe.time }} Minuten</p>
      <p><strong>Bewertung:</strong> {{ recipe.rating }}/5</p>
      <p>{{ recipe.description }}</p>
    </div>
    <div v-else>
      <p>Lade Rezept...</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const recipe = ref(null)
  // Rezepte holen
  onMounted(async () => {
    const id = route.params.id
    try {
      const res = await fetch(`http://localhost:3000/recipes/${id}`)
      if (!res.ok) throw new Error('Rezept nicht gefunden')
      recipe.value = await res.json()
    } catch (error) {
      console.error('Fehler beim Laden des Rezepts:', error)
    }
  })
  </script>