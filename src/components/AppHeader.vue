<!-- AppHeader.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 h-16 header-gradient z-40 border-b border-white/10">
    <div class="h-full flex items-center px-6">
      <!-- Left side with title and admin - Fixed width -->
      <div class="w-64 flex items-center space-x-6">
        <h1 class="text-lg font-semibold text-white/90 truncate">{{ title }}</h1>
      </div>

      <!-- Admin and Receiving Buttons Group -->
      <div class="mr-8 flex space-x-2">
        <!-- Admin Button -->
        <button
          v-if="isAdmin"
          @click="router.push('/admin')"
          class="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 rounded-lg transition-all group border border-primary/20"
        >
          <div class="relative">
            <div class="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
            <Cog6ToothIcon class="relative w-5 h-5 text-primary group-hover:text-primary/90 group-hover:rotate-90 transition-all duration-500" />
          </div>
          <span class="text-sm font-medium text-primary group-hover:text-primary/90">Admin Panel</span>
        </button>

        <!-- Receiving Button -->
        <router-link
          v-if="authStore.canAccessReceiving"
          to="/receiving"
          class="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 rounded-lg transition-all group border border-primary/20"
        >
          <div class="relative">
            <div class="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
            <ArrowDownTrayIcon class="relative w-5 h-5 text-primary group-hover:text-primary/90 transition-all duration-300" />
          </div>
          <span class="text-sm font-medium text-primary group-hover:text-primary/90">Receiving</span>
        </router-link>
      </div>

      <!-- Center section - Flex grow to center the nav -->
      <div class="flex-1 flex items-center justify-center space-x-4">
        <router-link 
          to="/" 
          class="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          :class="{ 'bg-white/10': $route.path === '/' }"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/queue" 
          class="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          :class="{ 'bg-white/10': $route.path === '/queue' }"
        >
          Queue
        </router-link>
      </div>

      <!-- Right side - Empty to maintain spacing -->
      <div class="w-64"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import {
  Cog6ToothIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'

defineProps<{
  title: string
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
</script>

<style scoped>
.header-gradient {
  background: linear-gradient(
    90deg,
    #0f1729,
    #141e33,
    #1a2540,
    #141e33,
    #0f1729
  );
  background-size: 400% 100%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 