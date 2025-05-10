<template>
    <div class="recipe-card">
      <img :src="image" alt="Gericht" />
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <p>Zubereitungszeit: {{ time }} Minuten</p>
      <p>Bewertung: {{ rating }} ★</p>
      <button @click="$emit('show-details')">Details anzeigen</button>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    description: String,
    time: Number,
    rating: Number,
    image: String
  })
  </script>
  
  <style scoped lang="scss">
  .recipe-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 10px;
    img {
      width: 100%;
      height: auto;
    }
  }
  </style>