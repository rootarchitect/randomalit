import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('../views/PasswordView.vue'),
    },
    {
      path: '/uuid',
      name: 'uuid',
      component: () => import('../views/UuidView.vue'),
    },
    {
      path: '/dice',
      name: 'dice',
      component: () => import('../views/DiceView.vue'),
    },
    {
      path: '/color',
      name: 'color',
      component: () => import('../views/ColorView.vue'),
    },
    {
      path: '/palette',
      name: 'palette',
      component: () => import('../views/PaletteView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/restaurant',
      name: 'restaurant',
      component: () => import('../views/RestaurantView.vue'),
    }
  ],
})

export default router
