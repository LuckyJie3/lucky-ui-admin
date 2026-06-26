import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TabItem {
  affix: boolean
  fullPath: string
  name: string
  path: string
  title: string
}

const hiddenPaths = new Set(['/login', '/404'])

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([])
  const activeTab = ref('')

  function addTab(route: { fullPath: string; meta: any; name: string | symbol | null | undefined; path: string }) {
    if (hiddenPaths.has(route.path) || route.path.startsWith('/404') || !route.meta?.title) return

    const tab: TabItem = {
      affix: Boolean(route.meta.affix),
      fullPath: route.fullPath,
      name: String(route.name || route.path),
      path: route.path,
      title: route.meta.title,
    }
    const index = tabs.value.findIndex((item) => item.path === route.path)

    if (index === -1) {
      tabs.value.push(tab)
    } else {
      tabs.value[index] = { ...tabs.value[index], fullPath: route.fullPath }
    }

    activeTab.value = route.path
  }

  function removeTab(path: string) {
    const target = tabs.value.find((item) => item.path === path)
    if (target?.affix) return

    tabs.value = tabs.value.filter((item) => item.path !== path)
    if (activeTab.value === path) activeTab.value = tabs.value.at(-1)?.path || ''
  }

  function removeOthers(path: string) {
    tabs.value = tabs.value.filter((item) => item.affix || item.path === path)
    activeTab.value = path
  }

  function removeAll() {
    tabs.value = tabs.value.filter((item) => item.affix)
    activeTab.value = tabs.value.at(-1)?.path || ''
  }

  return {
    activeTab,
    addTab,
    removeAll,
    removeOthers,
    removeTab,
    tabs,
  }
})
