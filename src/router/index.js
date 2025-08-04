import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IncidentsView from '../views/IncidentsView.vue'
import HealthView from '../views/HealthView.vue'
import ReportsView from '../views/ReportsView.vue'
import SettingsView from '../views/SettingsView.vue'
import SupportView from '../views/SupportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/incidents',
      name: 'incidents',
      component: IncidentsView
    },
    {
      path: '/health',
      name: 'health',
      component: HealthView
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/support',
      name: 'support',
      component: SupportView
    },
  ]
})

export default router
