<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <!-- Rezeptübersicht -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Rezeptübersicht</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-2">Durchschnittliche Bewertung</h2>
        <p class="text-3xl font-bold text-blue-600">{{ averageRating }}</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow md:col-span-2">
        <h2 class="text-lg font-semibold mb-2">Top 3 Rezepte</h2>
        <ul class="space-y-2">
          <li v-for="recipe in topRatedRecipes" :key="recipe.id" class="flex justify-between items-center">
            <span>{{ recipe.title }}</span>
            <span class="text-yellow-500 font-semibold">{{ recipe.rating }}/5</span>
          </li>
        </ul>
      </div>
      </div>
    </section>

    <!-- Diagramm: Bewertungen -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Bewertungsverlauf</h2>
      <Line :data="ratingsChartData" :options="chartOptions" />
    </section>

    <!-- Diagramm: Nährwerte -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Durchschnittliche Nährwerte</h2>
      <Bar :data="nutritionChartData" :options="chartOptions" />
    </section>

    <!-- Adminbereich -->
    <section v-if="userStore.user?.role === 'admin'" class="mb-8">
      <h2 class="text-2xl  mb-4">Adminfunktionen</h2>
      <div class="grid grid-cols-2 gap-4">
        <RouterLink
          to="/admin/users"
          class="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded shadow"
        >Benutzer verwalten</RouterLink>
        <RouterLink
          to="/admin/recipes"
          class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded shadow"
        >Rezepte verwalten</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import { useRecipeStore } from '../composables/useRecipeStore'
import { useUserStore } from '../composables/useUserStore'



ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
)

const recipeStore = useRecipeStore()
const userStore = useUserStore()
//onMounted(() => {
//  loadRecipes()
//})
const { averageRating, topRatedRecipes} = useRecipeStore()


const ratingsChartData = computed(() => ({
  labels: ['Januar', 'Februar', 'März', 'April', 'Mai'],
  datasets: [
    {
      label: 'Ø Bewertung',
      data: [3.8, 4.1, 4.3, 4.5, 4.4],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)'
    }
  ]
}))

const nutritionChartData = computed(() => ({
  labels: ['Kalorien', 'Eiweiß', 'Fett', 'Kohlenhydrate'],
  datasets: [
    {
      label: 'Durchschnitt pro Rezept',
      data: [400, 20, 15, 35],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false
    }
  }
}

console.log('Aktuelle Rolle:', userStore.user?.role)
</script>

<style scoped>
</style>
