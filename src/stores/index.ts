import { createPinia } from 'pinia'
import { getStorage } from '@/utils/storage'

const pinia = createPinia()

export function setupI18nSync(i18n: any) {
  const savedLocale = getStorage<string>('app-locale')

  if (savedLocale === 'zh-CN' || savedLocale === 'en-US') {
    i18n.global.locale.value = savedLocale
  }
}

export default pinia
