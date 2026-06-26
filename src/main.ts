import { createApp } from 'vue'
import App from './App.vue'
import pinia, { setupI18nSync } from './stores'
import router from './router'
import i18n from './locales'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

setupI18nSync(i18n)

app.mount('#app')
