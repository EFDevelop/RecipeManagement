<template>
  <div class="p-6">
    <!-- Überschrift für Administrator-Bereich -->
    <h1 class="text-3xl font-bold mb-6">Benutzerverwaltung</h1>
    <!-- Hinweis anzeigen, wenn keine Benutzer geladen wurden -->
    <div v-if="users.length === 0" class="text-gray-500">Keine Benutzer gefunden.</div>
    <!-- Tabelle mit Benutzerdaten -->
    <table v-else class="min-w-full table-auto">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left">Benutzername</th>
          <th class="px-4 py-2 text-left">E-Mail</th>
          <th class="px-4 py-2 text-left">Rolle</th>
          <th class="px-4 py-2 text-left">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        <!-- Zeile für jeden User -->
        <tr v-for="user in users" :key="user.id" class="border-b">
          <!-- Spalte: Username -->
          <td class="px-4 py-2">{{ user.username }}</td>
          <!-- Spalte: E-Mail-Adresse -->
          <td class="px-4 py-2">{{ user.email }}</td>
          <!-- Spalte: Rollenbezeichnung -->
          <td class="px-4 py-2">{{ user.role }}</td>
          <!-- Spalte: Aktionen (Löschen) -->
          <td class="px-4 py-2">
            <button
              @click="deleteUser(user.id)"
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
// Import der Composition API-Utilities
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Reaktive Referenz für die Liste der Benutzer
const users = ref([])

// Beim Mounten der Komponente Benutzer vom Backend laden
onMounted(async () => {
  try {
    // HTTP GET: alle Benutzer von json-server beziehen
    const response = await axios.get('http://localhost:3000/users')
    users.value = response.data // Daten im users-Array speichern
  } catch (err) {
    console.error('Fehler beim Laden der Benutzer:', err)
  }
})

/**
 * Löscht einen Benutzer anhand seiner ID.
 * Fragt zur Sicherheit eine Bestätigung ab.
 * Aktualisiert anschließend die lokale users-Liste.
 * @param {string|number} userId
 */
const deleteUser = async (userId) => {
  if (confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
    try {
      // HTTP DELETE: Benutzer auf dem Server entfernen
      await axios.delete(`http://localhost:3000/users/${userId}`)
      // Entferne den gelöschten Benutzer aus dem lokalen Array
      users.value = users.value.filter(u => u.id !== userId)
    } catch (err) {
      console.error('Fehler beim Löschen des Benutzers:', err)
    }
  }
}
</script>

<style scoped>
/* Hover-Effekt für den Löschen-Button */
button:hover {
  background-color: #f56565;
}
</style>
