<template>
  <div class="min-h-screen">
    <!-- Background -->
    <GlowingBackground />
    
    <!-- Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-surface-dark/30 backdrop-blur-sm p-8 rounded-xl border border-white/5">
        <!-- Title -->
        <div class="flex flex-col items-center">
          <div class="medatlas-title text-2xl font-bold tracking-wider flex items-center justify-center gap-[1px]">
            <span class="bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">Med</span>
            <span class="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">Atlas</span>
          </div>
          <p class="mt-3 text-center text-xs">
            <span class="text-white/40">
              <span class="atlas-letter" :class="{ 'atlas-highlight': highlightIndex === 0 }">A</span>dvanced 
              <span class="atlas-letter" :class="{ 'atlas-highlight': highlightIndex === 1 }">T</span>racking, 
              <span class="atlas-letter" :class="{ 'atlas-highlight': highlightIndex === 2 }">L</span>ogistics, & 
              <span class="atlas-letter" :class="{ 'atlas-highlight': highlightIndex === 3 }">A</span>dministration 
              <span class="atlas-letter" :class="{ 'atlas-highlight': highlightIndex === 4 }">S</span>ystem
            </span>
          </p>
          <div class="relative w-full my-6">
            <div class="ekg-line">
              <svg width="100%" height="40" viewBox="0 0 120 40" preserveAspectRatio="none">
                <path
                  class="ekg-path"
                  d="M 0,20 
                     L 18,20 
                     L 20,20 
                     L 22,8 
                     L 24,32 
                     L 26,4 
                     L 28,36 
                     L 30,20 
                     L 32,20 
                     L 120,20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  pathLength="100"
                />
              </svg>
            </div>
          </div>
          <h2 class="text-center text-2xl font-semibold text-white">
            Sign in to your account
          </h2>
        </div>

        <!-- Login Form -->
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                id="username"
                v-model="form.username"
                name="username"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-white/40 text-white bg-surface-dark/50 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-white/40 text-white bg-surface-dark/50 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div v-if="error" class="text-error text-sm text-center">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  v-if="!isLoading"
                  class="h-5 w-5 text-primary-dark group-hover:text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <!-- Demo Accounts -->
          <div class="mt-6">
            <h3 class="text-sm font-medium text-white/60 mb-2">Quick Access:</h3>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <button
                v-for="account in demoAccounts"
                :key="account.username"
                type="button"
                @click="fillDemoAccount(account)"
                class="px-2 py-1 bg-surface-dark/50 hover:bg-surface-darker text-white/60 hover:text-white rounded border border-white/10 transition-colors"
              >
                {{ account.label }}
              </button>
            </div>
            <!-- Kiosk Login Button -->
            <router-link
              to="/kiosk"
              class="mt-4 block w-full px-2 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-center rounded border border-sky-500/20 hover:border-sky-500/30 transition-colors text-sm font-medium"
            >
              Kiosk Mode
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import GlowingBackground from '../components/GlowingBackground.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')
const highlightIndex = ref(-1)
let highlightInterval: number | undefined

// ATLAS ripple effect
const startRippleEffect = () => {
  highlightIndex.value = 0
  highlightInterval = window.setInterval(() => {
    highlightIndex.value = (highlightIndex.value + 1) % 5
  }, 1500) // Slightly faster animation (from 2000ms to 1500ms)
}

onMounted(() => {
  startRippleEffect()
})

onUnmounted(() => {
  if (highlightInterval) {
    clearInterval(highlightInterval)
  }
})

const demoAccounts = [
  { username: 'admin', password: 'password', label: 'Admin' },
  { username: 'supervisor', password: 'password', label: 'Supervisor' },
  { username: 'lead', password: 'password', label: 'Lead Tech' },
  { username: 'tech', password: 'password', label: 'Technician' }
]

const fillDemoAccount = (account: { username: string; password: string }) => {
  form.value = {
    username: account.username,
    password: account.password
  }
}

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    await authStore.login(form.value.username, form.value.password)
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  } catch (e) {
    error.value = 'Invalid credentials'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.atlas-letter {
  @apply inline-block transition-all duration-1000 ease-in-out;
}

.atlas-highlight {
  @apply text-sky-400/70 font-medium scale-[103%];
  text-shadow: 0 0 6px rgba(56, 189, 248, 0.2);
}

.ekg-line {
  @apply text-sky-400/60;
  pointer-events: none;
}

.ekg-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: ekg-draw 2s linear infinite;
}

@keyframes ekg-draw {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: -100;
  }
}

.medatlas-title {
  text-shadow: 0 2px 10px rgba(56, 189, 248, 0.2);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style> 