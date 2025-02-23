<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-white">Audit Logs</h2>
        <p class="text-white/60">View and analyze system activity logs</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportLogs"
          class="px-4 py-2 bg-surface-dark hover:bg-surface-darker text-white/60 hover:text-white rounded-lg flex items-center gap-2 transition-colors border border-white/10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Logs
        </button>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-surface-dark hover:bg-surface-darker text-white/60 hover:text-white rounded-lg flex items-center gap-2 transition-colors border border-white/10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="relative">
        <input
          type="text"
          v-model="filters.search"
          placeholder="Search logs..."
          class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white placeholder-white/40"
        />
        <svg
          class="absolute right-3 top-2.5 w-5 h-5 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <select
        v-model="filters.type"
        class="px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
      >
        <option value="">All Types</option>
        <option value="auth">Authentication</option>
        <option value="system">System</option>
        <option value="user">User Activity</option>
        <option value="error">Errors</option>
      </select>
      <select
        v-model="filters.severity"
        class="px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
      >
        <option value="">All Severities</option>
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
        <option value="critical">Critical</option>
      </select>
      <input
        type="date"
        v-model="filters.date"
        class="px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
      />
    </div>

    <!-- Logs Table -->
    <div class="bg-surface-darker rounded-lg border border-white/10 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/10">
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Timestamp</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Action</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Severity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-white/5">
            <td class="px-6 py-4 text-sm text-white/60">
              {{ formatDate(log.timestamp) }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  {
                    'bg-primary/20 text-primary': log.type === 'auth',
                    'bg-info/20 text-info': log.type === 'system',
                    'bg-warning/20 text-warning': log.type === 'user',
                    'bg-error/20 text-error': log.type === 'error'
                  }
                ]"
              >
                {{ log.type }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-surface-dark flex items-center justify-center">
                  <span class="text-sm font-medium text-white">{{ log.user.charAt(0) }}</span>
                </div>
                <span class="ml-2 text-sm text-white">{{ log.user }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-white">
              {{ log.action }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  {
                    'bg-info/20 text-info': log.severity === 'info',
                    'bg-warning/20 text-warning': log.severity === 'warning',
                    'bg-error/20 text-error': log.severity === 'error',
                    'bg-error/40 text-error': log.severity === 'critical'
                  }
                ]"
              >
                {{ log.severity }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-white/60">
              {{ log.details }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-white/60">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalLogs }} entries
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 bg-surface-dark hover:bg-surface-darker text-white/60 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="text-white/60">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-surface-dark hover:bg-surface-darker text-white/60 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Log {
  id: string
  timestamp: string
  type: 'auth' | 'system' | 'user' | 'error'
  user: string
  action: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  details: string
}

// Filters state
const filters = ref({
  search: '',
  type: '',
  severity: '',
  date: ''
})

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

// Mock data
const logs = ref<Log[]>([
  {
    id: '1',
    timestamp: '2024-03-15T10:30:00Z',
    type: 'auth',
    user: 'John Smith',
    action: 'User login',
    severity: 'info',
    details: 'Successful login from 192.168.1.100'
  },
  {
    id: '2',
    timestamp: '2024-03-15T10:45:00Z',
    type: 'system',
    user: 'System',
    action: 'Backup completed',
    severity: 'info',
    details: 'Daily backup completed successfully'
  },
  {
    id: '3',
    timestamp: '2024-03-15T11:00:00Z',
    type: 'error',
    user: 'Sarah Johnson',
    action: 'API Error',
    severity: 'error',
    details: 'Failed to connect to external service'
  },
  {
    id: '4',
    timestamp: '2024-03-15T11:15:00Z',
    type: 'user',
    user: 'Michael Chen',
    action: 'Project created',
    severity: 'info',
    details: 'Created new project "Medical Records 2024"'
  },
  {
    id: '5',
    timestamp: '2024-03-15T11:30:00Z',
    type: 'system',
    user: 'System',
    action: 'Storage warning',
    severity: 'warning',
    details: 'Storage usage above 80%'
  }
])

// Computed properties
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      log.details.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      log.user.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchesType = !filters.value.type || log.type === filters.value.type
    const matchesSeverity = !filters.value.severity || log.severity === filters.value.severity
    const matchesDate = !filters.value.date || log.timestamp.startsWith(filters.value.date)
    return matchesSearch && matchesType && matchesSeverity && matchesDate
  })
})

const totalLogs = computed(() => filteredLogs.value.length)
const totalPages = computed(() => Math.ceil(totalLogs.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalLogs.value))

// Methods
const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    type: '',
    severity: '',
    date: ''
  }
  currentPage.value = 1
}

const exportLogs = () => {
  // Mock export functionality
  console.log('Exporting logs:', filteredLogs.value)
  // Here you would typically generate and download a CSV/Excel file
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script> 