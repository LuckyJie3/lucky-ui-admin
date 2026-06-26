import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'

const whiteList = ['/login', '/404']

export function setupGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    const title = (to.meta?.title as string) || ''
    document.title = title ? title + ' - Lucky Admin' : 'Lucky Admin'

    if (whiteList.includes(to.path) || to.path.startsWith('/404')) {
      next()
      return
    }

    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      next('/login?redirect=' + encodeURIComponent(to.fullPath))
      return
    }

    next()
  })
}
