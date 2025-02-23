<template>
  <div class="h-screen w-64 bg-[#0f1729] border-l border-white/10 fixed right-0 top-0">
    <!-- User Info -->
    <div class="p-4 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
          <span class="text-white font-medium">AU</span>
        </div>
        <div>
          <div class="text-white font-medium">Admin User</div>
          <div class="text-white/40 text-sm">ADMIN</div>
        </div>
      </div>
    </div>

    <div class="p-4">
      <!-- Quick Stats -->
      <div class="mb-6">
        <h3 class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Quick Stats</h3>
        
        <!-- Active Jobs -->
        <div class="bg-[#1e293b] rounded-lg p-4 border border-white/10 mb-3">
          <div class="text-white/60 text-sm">Active Jobs</div>
          <div class="text-2xl font-semibold text-white mt-1">{{ activeJobs.length }}</div>
        </div>

        <!-- Completed -->
        <div class="bg-[#1e293b] rounded-lg p-4 border border-white/10 mb-3">
          <div class="text-white/60 text-sm">Completed</div>
          <div class="text-2xl font-semibold text-white mt-1">{{ completedCount }}</div>
        </div>

        <!-- On Hold -->
        <div class="bg-[#1e293b] rounded-lg p-4 border border-white/10 mb-3">
          <div class="text-white/60 text-sm">On Hold</div>
          <div class="text-2xl font-semibold text-yellow-500 mt-1">{{ onHoldCount }}</div>
        </div>

        <!-- Urgent -->
        <div class="bg-[#1e293b] rounded-lg p-4 border border-white/10 mb-3">
          <div class="text-white/60 text-sm">Urgent</div>
          <div class="text-2xl font-semibold text-error mt-1">{{ urgentCount }}</div>
        </div>

        <!-- Total Boxes -->
        <div class="bg-[#1e293b] rounded-lg p-4 border border-white/10 mb-3">
          <div class="text-white/60 text-sm">Total Boxes</div>
          <div class="text-2xl font-semibold text-white mt-1">{{ totalBoxes }}</div>
        </div>

        <!-- Active Projects -->
        <div class="bg-[#1e293b] rounded-lg p-4 border border-white/10 mb-3">
          <div class="text-white/60 text-sm">Active Projects</div>
          <div class="text-2xl font-semibold text-primary mt-1">{{ activeProjects }}</div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div>
        <h3 class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Activity</h3>
        <div class="space-y-3">
          <div v-for="(activity, index) in recentActivity" :key="index" 
               class="bg-[#1e293b] rounded-lg p-3 border border-white/10">
            <div class="text-white/80 text-sm">{{ activity.message }}</div>
            <div class="text-white/40 text-xs mt-1">{{ activity.timeAgo }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useJobStore } from '../stores/jobs'
import { useAuthStore } from '../stores/auth'

const jobStore = useJobStore()
const authStore = useAuthStore()
const { activeJobs } = storeToRefs(jobStore)

const completedCount = computed(() => {
  return jobStore.completedJobs?.length || 0
})

const onHoldCount = computed(() => {
  return activeJobs.value.filter(job => job.status === 'On Hold').length
})

const urgentCount = computed(() => {
  return activeJobs.value.filter(job => job.status === 'Urgent').length
})

const totalBoxes = computed(() => {
  return activeJobs.value.reduce((total, job) => total + (job.boxCount || 0), 0)
})

const activeProjects = computed(() => {
  return new Set(activeJobs.value.map(job => job.projectId)).size
})

// Mock activity data - replace with real activity tracking
const recentActivity = ref([
  {
    message: 'New shipment added to Project 001',
    timeAgo: '2 mins ago'
  },
  {
    message: 'SLA alert for Client 0023',
    timeAgo: '15 mins ago'
  }
])
</script> 