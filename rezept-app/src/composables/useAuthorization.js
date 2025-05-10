import { computed } from 'vue'
import { useUserStore } from './useUserStore'

// Erlaubte Aktionen pro Rolle
const permissionMatrix = {
  user: {
    viewRecipes: true,
    createRecipes: true,
    updateOwnRecipe: true,
    deleteOwnRecipe: false,
    accessPremiumFeature: false,
    accessAdminPanel: false
  },
  premium: {
    viewRecipes: true,
    createRecipes: true,
    updateOwnRecipe: true,
    deleteOwnRecipe: false,
    accessPremiumFeature: true,
    accessAdminPanel: false
  },
  admin: {
    viewRecipes: true,
    createRecipes: true,
    updateOwnRecipe: true,
    deleteOwnRecipe: true,
    accessPremiumFeature: true,
    accessAdminPanel: true
  }
}

/**
 * useAuthorization – Composable für Berechtigungsprüfungen
 */
export function useAuthorization() {
  const userStore = useUserStore()
  const role = computed(() => userStore.user?.role || 'user')

  /**
   * Prüft, ob der eingeloggte Benutzer eine Aktion durchführen darf
   * @param {string} action – Schlüssel aus permissionMatrix
   * @returns {boolean}
   */
  function can(action) {
    const perms = permissionMatrix[role.value] || {}
    return !!perms[action]
  }

  /**
   * Prüft, ob der Benutzer eine von mehreren Aktionen kann
   * @param {string[]} actions
   */
  function canAny(actions) {
    return actions.some(a => can(a))
  }

  return { can, canAny, role }
}
