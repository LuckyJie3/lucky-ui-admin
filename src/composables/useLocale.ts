import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import enUS from 'element-plus/es/locale/lang/en'
import zhCN from 'element-plus/es/locale/lang/zh-cn'

export type Locale = 'zh-CN' | 'en-US'

const elementLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export function useLocale() {
  const i18n = useI18n()
  const appStore = useAppStore()

  const locale = computed(() => appStore.locale)
  const elLocale = computed(() => elementLocales[appStore.locale])

  function setLocale(value: Locale) {
    i18n.locale.value = value
    appStore.setLocale(value)
  }

  function toggleLocale() {
    setLocale(appStore.locale === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  return {
    elLocale,
    locale,
    setLocale,
    toggleLocale,
  }
}
