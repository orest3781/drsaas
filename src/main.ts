import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import router from './router'
import { useJobStore } from './stores/jobs'
import { mockJobs } from './stores/mockData'

// Create Pinia store
const pinia = createPinia()

// Create Vue I18n
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      // Add your translations here
    }
  }
})

// Create and mount the Vue application
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize job store with mock data
const jobStore = useJobStore()
jobStore.setJobs(mockJobs)

app.mount('#app')
