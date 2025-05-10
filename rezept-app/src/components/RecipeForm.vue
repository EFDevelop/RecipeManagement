<template>
  <div>
    <form @submit.prevent="handleSubmit(onSubmit)">
      <!-- Schritt-Navigation -->
      <div class="steps">
        <button
          v-for="(label, i) in stepLabels"
          :key="i"
          type="button"
          :class="{ active: currentStep === i }"
          @click="goToStep(i)"
        >
          {{ label }}
        </button>
      </div>

      <!-- Schritt 1: Grundlegende Informationen -->
      <div v-if="currentStep === 0">
        <div class="form-field">
          <label for="title">Titel *</label>
          <input id="title" v-model="fields.title" type="text" />
          <span v-if="errors.title" class="error">{{ errors.title }}</span>
        </div>

        <div class="form-field">
          <label for="description">Beschreibung *</label>
          <textarea id="description" v-model="fields.description"></textarea>
          <span v-if="errors.description" class="error">{{ errors.description }}</span>
        </div>

        <div class="form-field">
          <label for="category">Kategorie *</label>
          <input id="category" v-model="fields.category" type="text" />
          <span v-if="errors.category" class="error">{{ errors.category }}</span>
        </div>
      </div>

      <!-- Schritt 2: Zutaten -->
      <div v-if="currentStep === 1">
        <div
          v-for="(ingredient, index) in fields.ingredients"
          :key="index"
          class="form-field"
        >
          <label :for="`ingredient-${index}`">Zutat {{ index + 1 }}</label>
          <input
            :id="`ingredient-${index}`"
            v-model="fields.ingredients[index]"
            type="text"
          />
          <button type="button" @click="removeIngredient(index)">Entfernen</button>
        </div>
        <button type="button" @click="addIngredient">+ Zutat hinzufügen</button>
        <span v-if="errors.ingredients" class="error">{{ errors.ingredients }}</span>
      </div>

      <!-- Schritt 3: Zubereitungsschritte -->
      <div v-if="currentStep === 2">
        <draggable v-model="fields.instructions" item-key="index" class="draggable-list">
          <template #item="{ element, index }">
            <div class="form-field">
              <label :for="`step-${index}`">Schritt {{ index + 1 }}</label>
              <textarea :id="`step-${index}`" v-model="fields.instructions[index]"></textarea>
              <button type="button" @click="removeStep(index)">Entfernen</button>
            </div>
          </template>
        </draggable>
        <button type="button" @click="addStep">+ Schritt hinzufügen</button>
        <span v-if="errors.instructions" class="error">{{ errors.instructions }}</span>
      </div>

      <!-- Schritt 4: Bild + Nährwerte + Zeit -->
      <div v-if="currentStep === 3">
        <div class="form-field">
          <label for="time">Zubereitungszeit (Minuten) *</label>
          <input id="time" v-model="fields.time" type="number" />
          <span v-if="errors.time" class="error">{{ errors.time }}</span>
        </div>
        <div class="form-field">
          <label for="image">Bild</label>
          <input id="image" type="file" accept="image/*" @change="handleImageUpload" />
          <img v-if="fields.image" :src="fields.image" alt="Vorschau" class="preview" />
        </div>

        <div class="form-field">
          <label for="calories">Kalorien (kcal)</label>
          <input id="calories" v-model="fields.nutrition.calories" type="number" />
        </div>

        <div class="form-field">
          <label for="protein">Protein (g)</label>
          <input id="protein" v-model="fields.nutrition.protein" type="number" />
        </div>

        <div class="form-field">
          <label for="fat">Fett (g)</label>
          <input id="fat" v-model="fields.nutrition.fat" type="number" />
        </div>
      </div>

      <!-- Navigation unten -->
      <div class="form-navigation">
        <button type="button" @click="prevStep" :disabled="currentStep === 0">Zurück</button>
        <button type="button" @click="nextStep" v-if="currentStep < stepLabels.length - 1">Weiter</button>
        <button type="submit" v-else :disabled="isSubmitting">Rezept erstellen</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="js">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useForm } from '../composables/useForm'
import { useLocalStorage } from '../composables/useLocalStorage'
import {
  required,
  minLength,
  isPositiveNumber,
  isUniqueTitle
} from '../utils/validationRules'

// Schritt-Steuerung
const stepLabels = ['Details', 'Zutaten', 'Schritte', 'Bild & Nährwerte']
const currentStep = ref(0)
const goToStep = (index) => {
  console.log('goToStep:', index)
  currentStep.value = index
}
const nextStep = () => {
  console.log('nextStep from:', currentStep.value)
  if (currentStep.value < stepLabels.length - 1) currentStep.value++
  console.log('nextStep to:', currentStep.value)
}
const prevStep = () => {
  console.log('prevStep from:', currentStep.value)
  if (currentStep.value > 0) currentStep.value--
  console.log('prevStep to:', currentStep.value)
}

// Default-Felder
const defaultFields = {
  title: '',
  description: '',
  category: '',
  ingredients: [''],
  instructions: [''],
  time: null,
  image: '',
  nutrition: { calories: null, protein: null, fat: null }
}

// LocalStorage
const savedData = useLocalStorage('recipeFormDraft', null)

// Initialdaten Merging
const initialData = { ...defaultFields, ...(savedData.value || {}) }
if (!Array.isArray(initialData.ingredients)) initialData.ingredients = ['']
if (!Array.isArray(initialData.instructions)) initialData.instructions = ['']

// useForm-Destructuring
const { fields, errors, handleSubmit, isSubmitting } = useForm(
  initialData,
  {
    title: [required('Titel'), minLength(3), isUniqueTitle],
    description: [required('Beschreibung')],
    //category: [required('Kategorie')],
    ingredients: [required('Zutaten')],
    instructions: [required('Zubereitung')],
    time: [required('Zubereitungszeit'), isPositiveNumber]
  }
)

// Watch-Felder
watch(fields, (newVal) => {
  console.log('fields changed:', newVal)
  savedData.value = newVal
}, { deep: true })

// Zutaten-Handler
const addIngredient = () => {
  console.log('before addIngredient:', fields.value.ingredients)
  if (!Array.isArray(fields.value.ingredients)) {
    // Initialisierung, falls aus irgendeinem Grund kein Array da ist
    fields.value.ingredients = ['']
  } else {
    fields.value.ingredients.push('')
  }
  console.log('after addIngredient:', fields.value.ingredients)
}
const removeIngredient = (index) => {
  console.log('removeIngredient at:', index)
  fields.value.ingredients.splice(index, 1)
  console.log('after removeIngredient:', fields.value.ingredients)
}

// Schritte-Handler
const addStep = () => {
  console.log('before addStep:', fields.value.instructions)
  if (!Array.isArray(fields.value.instructions)) {
    fields.value.instructions = ['']
  } else {
    fields.value.instructions.push('')
  }
  console.log('after addStep:', fields.value.instructions)
}
const removeStep = (index) => {
  console.log('removeStep at:', index)
  fields.value.instructions.splice(index, 1)
  console.log('after removeStep:', fields.value.instructions)
}

// Bild-Upload
const handleImageUpload = (e) => {
  console.log('handleImageUpload event:', e)
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      fields.image = reader.result
      console.log('image loaded, fields.image:', fields.image)
    }
    reader.readAsDataURL(file)
  }
}

// Emit-Handling
const emit = defineEmits(['recipe-created'])
const onSubmit = async (formData) => {
  console.log('onSubmit formData:', formData)
  const newRecipe = { ...formData, id: `recipe-${Date.now()}` }
  emit('recipe-created', newRecipe)
  console.log('recipe-created emitted:', newRecipe)
  savedData.value = null
  Object.assign(fields, defaultFields)
  currentStep.value = 0
  console.log('form reset, currentStep:', currentStep.value)
}
</script>

<style scoped>
.form-field { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; }
input, textarea { width: 95%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
textarea { min-height: 100px; }
button { margin-top: 0.5rem; margin-right: 0.5rem; }
.error { color: red; font-size: 0.9rem; }
.steps { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.steps button.active { font-weight: bold; background: #007bff; color: white; }
.form-navigation { margin-top: 1rem; }
.preview { display: block; margin-top: 1rem; max-width: 100%; max-height: 200px; }
.draggable-list { display: flex; flex-direction: column; gap: 1rem; }
</style>
