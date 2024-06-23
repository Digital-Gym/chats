import { createRouter, createWebHistory } from 'vue-router'
import PollingView from '../views/PollingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'polling',
      component: PollingView
    },
    {
      path: '/event-sourcing',
      name: 'eventSourcing',
      component: () => import('../views/EventSourcingView.vue')
    },
    {
      path: '/websockets',
      name: 'websockets',
      component: () => import('../views/WebSocketView.vue')
    }
  ]
})

export default router
