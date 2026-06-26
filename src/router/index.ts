import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes, layoutRoute } from './routes'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...constantRoutes,
    layoutRoute,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

setupGuards(router)

export default router
