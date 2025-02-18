<template>
  <div class="p-6">
    <div class="space-y-4">
      <!-- Client Groups -->
      <div v-for="client in queuedJobs" :key="client.id" class="bg-surface-dark rounded-lg border border-white/10">
        <!-- Client Header -->
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 class="text-white font-medium">{{ client.name }}</h3>
            <div class="text-white/60 text-sm">{{ client.totalBoxes }} boxes total</div>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="client.hasUrgent" class="px-2 py-1 text-xs font-medium bg-error/20 text-error rounded-full">
              Urgent
            </span>
            <button class="p-1 text-white/60 hover:text-white hover:bg-white/5 rounded">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Projects List -->
        <div class="divide-y divide-white/10">
          <div v-for="project in client.projects" :key="project.id" class="p-4 hover:bg-white/5 transition-colors">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-white font-medium">{{ project.name }}</span>
                  <span v-if="project.priority === 'urgent'" class="px-2 py-0.5 text-xs font-medium bg-error/20 text-error rounded-full">
                    Urgent
                  </span>
                </div>
                <div class="text-white/60 text-sm mt-1">{{ project.boxCount }} boxes</div>
                <div class="text-white/40 text-xs mt-0.5">{{ project.shipmentId }}</div>
              </div>
              <div class="text-right">
                <div class="text-white/60 text-sm">Received</div>
                <div class="text-white/40 text-xs">{{ formatDate(project.receivedDate) }}</div>
              </div>
            </div>
            <div class="mt-3 flex items-center gap-4">
              <div class="flex items-center gap-2 text-xs text-white/60">
                <span class="w-2 h-2 rounded-full" :class="getSLAStatusColor(project)"></span>
                <span>{{ project.sla }} hour SLA</span>
              </div>
              <div class="text-xs text-white/60">
                Due by {{ formatDate(project.dueDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock data for queued jobs
const queuedJobs = ref([
  {
    id: 1,
    name: 'Acme Corp',
    totalBoxes: 45,
    hasUrgent: true,
    projects: [
      {
        id: 101,
        name: 'Annual Reports 2024',
        priority: 'urgent',
        boxCount: 25,
        shipmentId: 'C0001P001B00001',
        receivedDate: '2024-02-18T08:30:00',
        dueDate: '2024-02-19T08:30:00',
        sla: 24
      },
      {
        id: 102,
        name: 'Employee Records',
        priority: 'normal',
        boxCount: 20,
        shipmentId: 'C0001P002B00001',
        receivedDate: '2024-02-18T09:15:00',
        dueDate: '2024-02-20T09:15:00',
        sla: 48
      }
    ]
  },
  {
    id: 2,
    name: 'Global Finance',
    totalBoxes: 30,
    hasUrgent: false,
    projects: [
      {
        id: 201,
        name: 'Transaction Records',
        priority: 'normal',
        boxCount: 30,
        shipmentId: 'C0002P001B00001',
        receivedDate: '2024-02-18T10:00:00',
        dueDate: '2024-02-21T10:00:00',
        sla: 72
      }
    ]
  },
  {
    id: 3,
    name: 'Healthcare Plus',
    totalBoxes: 60,
    hasUrgent: true,
    projects: [
      {
        id: 301,
        name: 'Patient Records 2023',
        priority: 'urgent',
        boxCount: 35,
        shipmentId: 'C0003P001B00001',
        receivedDate: '2024-02-18T11:30:00',
        dueDate: '2024-02-19T11:30:00',
        sla: 24
      },
      {
        id: 302,
        name: 'Insurance Claims',
        priority: 'normal',
        boxCount: 25,
        shipmentId: 'C0003P002B00001',
        receivedDate: '2024-02-18T12:00:00',
        dueDate: '2024-02-20T12:00:00',
        sla: 48
      }
    ]
  }
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

const getSLAStatusColor = (project) => {
  const now = new Date()
  const dueDate = new Date(project.dueDate)
  const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursUntilDue <= project.sla * 0.25) return 'bg-error'
  if (hoursUntilDue <= project.sla * 0.5) return 'bg-warning'
  return 'bg-success'
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 