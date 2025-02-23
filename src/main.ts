import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import router from './router'
import { useJobStore } from './stores/jobs'
import { mockJobs } from './stores/mockData'

// Create Vue application
const app = createApp(App)

// Create and install Pinia
const pinia = createPinia()
app.use(pinia)

// Create and install Vue I18n
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      // Add your translations here
    }
  }
})
app.use(i18n)

// Install router
app.use(router)

// Mount the app
app.mount('#app')

// Initialize job store with mock data (after mounting)
const jobStore = useJobStore()
jobStore.setJobs(mockJobs)
