import { createRouter, createWebHistory } from 'vue-router'
import RecipeList        from '../components/RecipeList.vue'
import RecipeDetail      from '../components/RecipeDetail.vue'
import UserProfile       from '../components/UserProfile.vue'
import NotFound          from '../components/NotFound.vue'
import FavoritesView     from '../views/FavoritesView.vue'
import CreateRecipeView  from '../views/CreateRecipeView.vue'
import Dashboard         from '../components/Dashboard.vue'
import AdminUsers        from '../components/AdminUsers.vue'
import AdminRecipes      from '../components/AdminRecipes.vue'
import { userStore }         from '../composables/useUserStore'
import { useAuthorization }  from '../composables/useAuthorization'

const routes = [
  { path: '/',           name: 'RecipeList',       component: RecipeList,        meta: { permission: 'viewRecipes' } },
  { path: '/recipe/:id', name: 'RecipeDetail',     component: RecipeDetail,      meta: { permission: 'viewRecipes' } },
  { path: '/favoriten',  name: 'Favorites',        component: FavoritesView,     meta: { permission: 'viewRecipes' } },
  { path: '/create',     name: 'CreateRecipe',     component: CreateRecipeView,  meta: { permission: 'createRecipes' } },
  { path: '/profile',    name: 'UserProfile',      component: UserProfile,       meta: { permission: null } },

  // Dashboard für Premium & Admin (gemeinsame Berechtigung)
  { path: '/dashboard',  name: 'Dashboard',        component: Dashboard,         meta: { permission: 'accessPremiumFeature' } },

  // Admin-Routen (nur für Admin mit accessAdminPanel)
  { path: '/admin/users',   name: 'AdminUsers',    component: AdminUsers,        meta: { permission: 'accessAdminPanel' } },
  { path: '/admin/recipes', name: 'AdminRecipes',  component: AdminRecipes,      meta: { permission: 'accessAdminPanel' } },

  // Fallback
  { path: '/:pathMatch(.*)*', name: 'NotFound',    component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = userStore
  const { can } = useAuthorization()

  if (!to.meta.permission) {
    return next()
  }

  if (!isLoggedIn) {
    return next({ name: 'UserProfile' })
  }

  if (!can(to.meta.permission)) {
    return next({ name: 'NotFound' })
  }

  next()
})

export default router
