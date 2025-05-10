<template>
  <div v-if="!userStore.isLoggedIn">
    <form @submit.prevent="handleLogin">
      <div class="form-field">
        <label for="username">Benutzername:</label>
        <input v-model="username" id="username" type="text" />
      </div>

      <div class="form-field">
        <label for="password">Passwort:</label>
        <input v-model="password" id="password" type="password" />
      </div>

      <button type="submit">Anmelden</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>

  <div v-else>
    <h2>Willkommen, {{ userStore.user.username }}</h2>
    <p>Rolle: {{ userStore.user.role }}</p>
    <button @click="logout">Abmelden</button>

    <form @submit.prevent="updateProfile">
      <input v-model="profileData.email" placeholder="E-Mail" />
      <button type="submit">Profil aktualisieren</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../composables/useUserStore'

const userStore = useUserStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const profileData = ref({
  email: ''
})

function handleLogin() {
  userStore.login(username.value, password.value)
  if (!userStore.isLoggedIn) {
    errorMessage.value = 'Falsche Anmeldedaten'
  } else {
    errorMessage.value = ''
  }
}

function logout() {
  userStore.logout()
}

function updateProfile() {
  userStore.updateProfile(profileData.value)
}
</script>

<style scoped>
.error {
  color: red;
}

.form-field {
  margin-bottom: 1rem; /* Abstand zwischen den Feldern */
}

label {
  display: block; /* Label auf eine neue Zeile setzen */
  margin-bottom: 0.5rem; /* Abstand zwischen Label und Input */
}

input {
  width: 200px; /* Input nimmt die ganze Breite ein */
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>