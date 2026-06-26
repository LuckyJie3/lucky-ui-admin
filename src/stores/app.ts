import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import type { Locale } from '@/composables/useLocale'
import type { ThemeMode } from '@/composables/useTheme'

const DEFAULT_PRIMARY = '#0f8f8c'

export const useAppStore = defineStore('app', () => {
  const themeMode = ref<ThemeMode>((getStorage('theme-mode') as ThemeMode) || 'light')
  const locale = ref<Locale>((getStorage('app-locale') as Locale) || 'zh-CN')
  const sidebarCollapsed = ref(getStorage<string>('sidebar-collapsed') === 'true')
  const showBreadcrumb = ref(getStorage<string>('show-breadcrumb') !== 'false')
  const showFooter = ref(getStorage<string>('show-footer') === 'true')
  const compactMode = ref(getStorage<string>('compact-mode') === 'true')
  const primaryColor = ref(getStorage<string>('primary-color') || DEFAULT_PRIMARY)

  function setThemeMode(mode: ThemeMode) {
    themeMode.value = mode
    setStorage('theme-mode', mode)
  }

  function setLocale(value: Locale) {
    locale.value = value
    setStorage('app-locale', value)
  }

  function setSidebarCollapsed(value: boolean) {
    sidebarCollapsed.value = value
    setStorage('sidebar-collapsed', String(value))
  }

  function toggleSidebar() {
    setSidebarCollapsed(!sidebarCollapsed.value)
  }

  function setShowBreadcrumb(value: boolean) {
    showBreadcrumb.value = value
    setStorage('show-breadcrumb', String(value))
  }

  function setShowFooter(value: boolean) {
    showFooter.value = value
    setStorage('show-footer', String(value))
  }

  function setCompactMode(value: boolean) {
    compactMode.value = value
    setStorage('compact-mode', String(value))
  }

  function setPrimaryColor(value: string) {
    primaryColor.value = value
    setStorage('primary-color', value)
  }

  function resetPreferences() {
    setThemeMode('light')
    setLocale('zh-CN')
    setSidebarCollapsed(false)
    setShowBreadcrumb(true)
    setShowFooter(false)
    setCompactMode(false)
    setPrimaryColor(DEFAULT_PRIMARY)
  }

  return {
    compactMode,
    locale,
    primaryColor,
    showBreadcrumb,
    showFooter,
    sidebarCollapsed,
    themeMode,
    resetPreferences,
    setCompactMode,
    setLocale,
    setPrimaryColor,
    setShowBreadcrumb,
    setShowFooter,
    setSidebarCollapsed,
    setThemeMode,
    toggleSidebar,
  }
})
