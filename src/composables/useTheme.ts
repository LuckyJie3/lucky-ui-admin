import { computed, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'

export type ThemeMode = 'light' | 'dark' | 'auto'

const resolvedTheme = ref<'light' | 'dark'>('light')
let initialized = false
let mediaQuery: MediaQueryList | undefined

function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)

  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`
}

function applyColor(color: string) {
  document.documentElement.style.setProperty('--color-primary', color)
  document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(color))
}

function applyTheme(mode: ThemeMode, primaryColor: string, compactMode: boolean) {
  const resolved = mode === 'auto' ? getSystemTheme() : mode

  resolvedTheme.value = resolved
  document.documentElement.dataset.theme = resolved
  document.documentElement.dataset.density = compactMode ? 'compact' : 'comfortable'
  applyColor(primaryColor)
}

export function useTheme() {
  const appStore = useAppStore()

  if (!initialized) {
    initialized = true
    mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    mediaQuery?.addEventListener('change', () => {
      if (appStore.themeMode === 'auto') {
        applyTheme(appStore.themeMode, appStore.primaryColor, appStore.compactMode)
      }
    })

    watch(
      () => [appStore.themeMode, appStore.primaryColor, appStore.compactMode] as const,
      ([themeMode, primaryColor, compactMode]) => applyTheme(themeMode, primaryColor, compactMode),
      { immediate: true },
    )
  }

  function setTheme(mode: ThemeMode) {
    appStore.setThemeMode(mode)
  }

  function toggleTheme() {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const current = modes.indexOf(appStore.themeMode)
    setTheme(modes[(current + 1) % modes.length])
  }

  return {
    isDark: computed(() => resolvedTheme.value === 'dark'),
    resolved: resolvedTheme,
    setPrimaryColor: appStore.setPrimaryColor,
    setTheme,
    themeMode: computed(() => appStore.themeMode),
    toggleTheme,
  }
}
