import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      isSsr: true
    },
    component: HomeView
  },
  {
    path: '/axios',
    name: 'axios',
    meta: {
      isSsr: true
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AxiosView.vue')
  }
]

export function createRouter() {
  const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: routes
  })
  return router
}
