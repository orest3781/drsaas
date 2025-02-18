<template>
  <div class="p-6">
    <!-- 4 Column Grid with 4:3 Cards -->
    <div class="grid grid-cols-4 gap-6">
      <TransitionGroup name="job" tag="div" class="grid grid-cols-4 gap-6 col-span-4">
        <div v-for="job in activeJobs" :key="job.id" 
             :class="[
               'relative bg-[#1e293b] rounded-lg border overflow-hidden transition-all duration-500',
               job.id === jobStore.recentlyCompleted ? 'scale-95 opacity-50 transform translate-x-[-100%]' : 'border-white/10 hover:border-white/20'
             ]">
          <!-- Card Content -->
          <div class="h-full p-4 flex flex-col">
            <!-- Header Section -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-white/60 text-xs font-medium">{{ job.clientName }}</span>
              <span :class="getStatusClass(job.status)" class="text-xs px-2 py-0.5 rounded-full">
                {{ job.status }}
              </span>
            </div>
            <div class="text-white font-medium mb-1">{{ job.projectName }}</div>
            <div class="text-white/60 text-xs mb-3">{{ job.jobId }}</div>
            
            <!-- Step Progress Bars -->
            <div class="space-y-2 mb-3">
              <div v-for="(step, index) in workflowSteps" :key="index" class="flex items-center gap-2">
                <div class="w-16 text-white/60 text-[10px] font-medium">{{ step }}</div>
                <div class="flex-1 bg-white/5 rounded-full h-1">
                  <div class="h-1 rounded-full" 
                       :class="getProgressBarColor(job.steps[step])"
                       :style="{ width: job.steps[step].progress + '%' }"></div>
                </div>
                <div class="w-8 text-right text-white/40 text-[10px]">
                  <template v-if="job.steps[step].progress === 100">
                    <span class="text-success">✓</span>
                  </template>
                  <template v-else>
                    {{ job.steps[step].progress }}%
                  </template>
                </div>
                <div v-if="job.steps[step].operator" 
                     class="w-6 h-4 flex items-center justify-center bg-white/10 rounded text-[10px] text-white/60">
                  {{ getInitials(job.steps[step].operator) }}
                </div>
                <div v-if="job.steps[step].lastUpdated" 
                     class="text-[10px] text-white/40 ml-1">
                  {{ formatElapsedTime(job.steps[step].lastUpdated) }}
                </div>
              </div>
            </div>

            <!-- Footer Section -->
            <div class="mt-auto space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-white/60">Current Operator</span>
                <span class="text-white">{{ job.operator }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-white/60">Current Step</span>
                <span class="text-white">{{ job.currentStep }}</span>
              </div>
              <!-- Complete Job Button -->
              <button v-if="isJobReadyToComplete(job)"
                      @click="completeJob(job.id)"
                      class="w-full py-1.5 px-2 text-xs font-medium text-white bg-success/20 hover:bg-success/30 rounded transition-colors group">
                <span class="inline-flex items-center">
                  Complete Job
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJobStore } from '../stores/jobs'
import type { Job } from '../types'

const jobStore = useJobStore()
const activeJobs = computed(() => jobStore.activeJobs)

const currentDate = ref(new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

const workflowSteps = ['PREP', 'SCAN', 'QC', 'INDEX', 'REPREP']

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}

const getStatusClass = (status: string) => {
  const classes = {
    'Urgent': 'bg-error/20 text-error',
    'In Progress': 'bg-primary/20 text-primary',
    'On Hold': 'bg-warning/20 text-warning',
    'Completed': 'bg-success/20 text-success'
  }
  return classes[status] || 'bg-white/20 text-white'
}

const formatElapsedTime = (timestamp: string) => {
  const now = new Date()
  const updated = new Date(timestamp)
  const diffInMinutes = Math.floor((now - updated) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  } else {
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h${minutes}m`
  }
}

const getProgressBarColor = (step) => {
  if (!step.lastUpdated) return 'bg-primary'
  
  const now = new Date()
  const lastUpdated = new Date(step.lastUpdated)
  const hoursElapsed = (now - lastUpdated) / (1000 * 60 * 60)
  
  if (hoursElapsed <= 1) return 'bg-success'
  if (hoursElapsed <= 2) return 'bg-warning'
  if (hoursElapsed <= 3) return 'bg-error'
  return 'bg-error'
}

const getTodayAt = (hour: number, minute: number = 0) => {
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const getCurrentHour = () => {
  return new Date().getHours()
}

const getRecentTimestamp = () => {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  return getTodayAt(hour, minute)
}

const getRandomMinutes = (max: number = 59) => {
  return Math.floor(Math.random() * max)
}

const getTimestampWithinRange = (hoursAgo: number) => {
  const now = new Date()
  now.setHours(now.getHours() - hoursAgo, getRandomMinutes())
  return now.toISOString()
}

const isJobReadyToComplete = (job: Job): boolean => {
  // Check if all steps are at 100%
  return Object.values(job.steps).every(step => step.progress === 100)
}

const completeJob = (jobId: number) => {
  jobStore.completeJob(jobId)
}
</script>

<style scoped>
.status-badge {
  @apply px-2 py-0.5 rounded-full text-xs;
}

.job-move {
  transition: all 0.5s ease;
}

.job-enter-active,
.job-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.job-enter-from,
.job-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.9);
}

.job-leave-active {
  position: absolute;
}

/* Update card layout styles */
.grid {
  grid-auto-rows: minmax(min-content, max-content);
}

/* Ensure consistent card height */
.grid > div {
  min-height: 24rem;
  height: 100%;
}

/* Add hover effect for complete button */
.group:hover svg {
  transform: translateX(0.25rem);
}
</style> 