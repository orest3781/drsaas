<template>
  <div class="min-h-screen bg-[#0f1729] flex">
    <!-- Left Navigation -->
    <nav class="w-80 h-screen bg-[#0f1729] border-r border-white/10 fixed left-0 top-0 z-10">
      <!-- Logo -->
      <div class="h-16 border-b border-white/10 flex items-center justify-center">
        <span class="text-white/90 text-sm font-semibold">BPO Dashboard</span>
      </div>

      <!-- Navigation Links -->
      <div class="flex flex-col h-[calc(100vh-4rem)]">
        <div class="px-4 py-4 flex-1 overflow-y-auto">
          <!-- Production -->
          <div class="mb-6">
            <div class="px-2 mb-2">
              <span class="text-[10px] text-white/40 font-medium uppercase tracking-wider">Production</span>
            </div>
            <router-link to="/" class="flex items-center px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span class="ml-3 text-sm font-medium">Dashboard</span>
            </router-link>
            <router-link to="/queue" class="flex items-center px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span class="ml-3 text-sm font-medium">Queue</span>
            </router-link>
          </div>

          <!-- Ready for Delivery -->
          <div class="mb-6">
            <div class="px-2 mb-2 flex items-center justify-between">
              <span class="text-[10px] text-white/40 font-medium uppercase tracking-wider">Ready for Delivery</span>
              <span class="text-[10px] text-success px-1.5 py-0.5 rounded-full bg-success/10">{{ completedJobs.length }}</span>
            </div>
            <TransitionGroup 
              name="completed" 
              tag="div" 
              class="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-surface-darker"
            >
              <div v-for="job in completedJobs" :key="job.id" 
                   class="p-3 bg-surface-dark rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer">
                <div class="text-sm font-medium text-white/80 truncate">{{ job.clientName }}</div>
                <div class="text-xs text-white/40 truncate">{{ job.projectName }}</div>
                <div class="text-xs text-white/40 font-mono truncate">{{ job.jobId }}</div>
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-xs text-success bg-success/10 px-2 py-0.5 rounded">Complete</span>
                  <span class="text-xs text-white/40">{{ formatElapsedTime(job.steps.REPREP.lastUpdated) }}</span>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <div class="flex-1 ml-80 mr-80">
      <!-- Static Header Strip -->
      <div class="h-16 bg-surface-dark border-b border-accent/20 flex items-center justify-between px-6 fixed top-0 left-80 right-80 z-20">
        <h1 class="text-lg font-semibold text-white/90">{{ currentRouteName }}</h1>
        <div class="text-white/60 font-medium">{{ currentDateTime }}</div>
      </div>

      <div class="min-h-screen w-full pt-16">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <!-- Right Navigation -->
    <nav class="w-80 h-screen bg-[#0f1729] border-l border-white/10 fixed right-0 top-0 z-10">
      <!-- Status Section -->
      <div class="h-16 border-b border-white/10 flex items-center justify-center">
        <span class="text-white/90 text-sm font-semibold">Status</span>
      </div>

      <!-- Quick Stats -->
      <div class="px-4 py-4">
        <div class="mb-6">
          <div class="px-2 mb-2">
            <span class="text-[10px] text-white/40 font-medium uppercase tracking-wider">Quick Stats</span>
          </div>
          <div class="p-3 bg-surface-dark rounded-lg border border-white/10">
            <div class="text-white/60 text-sm mb-1">Active Jobs</div>
            <div class="text-white font-medium text-lg">{{ activeJobs.length }}</div>
          </div>
          <div class="p-3 bg-surface-dark rounded-lg border border-white/10 mt-2">
            <div class="text-white/60 text-sm mb-1">Completed</div>
            <div class="text-white font-medium text-lg">{{ completedJobs.length }}</div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="mb-6">
          <div class="px-2 mb-2">
            <span class="text-[10px] text-white/40 font-medium uppercase tracking-wider">Activity</span>
          </div>
          <div class="p-3 bg-surface-dark rounded-lg border border-white/10">
            <div class="text-white/60 text-sm leading-tight">New shipment added to Project 001</div>
            <div class="text-white/40 text-xs mt-1">2 mins ago</div>
          </div>
          <div class="p-3 bg-surface-dark rounded-lg border border-white/10 mt-2">
            <div class="text-white/60 text-sm leading-tight">SLA alert for Client 0023</div>
            <div class="text-white/40 text-xs mt-1">15 mins ago</div>
          </div>
        </div>

        <!-- System Status -->
        <div>
          <div class="px-2 mb-2">
            <span class="text-[10px] text-white/40 font-medium uppercase tracking-wider">System</span>
          </div>
          <div class="p-3 bg-surface-dark rounded-lg border border-white/10">
            <div class="text-white/60 text-sm mb-1">Scanner Status</div>
            <div class="text-success text-sm font-medium">Online</div>
          </div>
          <div class="p-3 bg-surface-dark rounded-lg border border-white/10 mt-2">
            <div class="text-white/60 text-sm mb-1">Storage</div>
            <div class="text-warning text-sm font-medium">72% Used</div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useJobStore } from './stores/jobs'
import { ref, onMounted } from 'vue'
import { computed } from '@vue/reactivity'
import type { Job } from './types'

const route = useRoute()
const currentRouteName = computed(() => {
  const name = route.name?.toString() || 'Dashboard'
  switch (name) {
    case 'dashboard':
      return 'Dashboard'
    case 'queue':
      return 'Queue'
    default:
      return name.charAt(0).toUpperCase() + name.slice(1)
  }
})

const jobStore = useJobStore()
const { completedJobs, activeJobs } = storeToRefs(jobStore)

// Date time handling
const currentDateTime = ref('')
let timeInterval: number | undefined

const updateDateTime = () => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  currentDateTime.value = now.toLocaleDateString('en-US', options)
}

onMounted(() => {
  updateDateTime()
  timeInterval = window.setInterval(updateDateTime, 1000)
})

onMounted(() => {
  return () => {
    if (timeInterval) {
      clearInterval(timeInterval)
    }
  }
})

const formatElapsedTime = (timestamp: string): string => {
  const now = new Date()
  const updated = new Date(timestamp)
  const diffInMinutes: number = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else {
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h${minutes}m ago`
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Job card animations */
.job-move, 
.job-enter-active,
.job-leave-active {
  transition: all 0.5s ease;
}

.job-enter-from,
.job-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Ensure proper stacking during move */
.job-leave-active {
  position: absolute;
}

/* Completed jobs drawer animations */
.completed-enter-active,
.completed-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.completed-enter-from,
.completed-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateX(-20px);
}

/* Hover animations */
.hover-slide {
  transition: transform 0.2s ease;
}

.hover-slide:hover {
  transform: translateX(4px);
}
</style>