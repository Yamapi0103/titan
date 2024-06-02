import { createRouter, createWebHistory } from 'vue-router'
import Verify from '@/views/VerifyPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'verify',
      component: Verify
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requiresAuth: true
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ProfilePage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      console.log('innn')
      next({ name: 'verify' })
    }
  }
  next()
})
export default router
