<template>
  <div class="min-h-screen bg-[#0f1729] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p class="mt-2 text-white/60">View and analyze production metrics and performance data</p>
      </div>

      <!-- Report Filters -->
      <div class="bg-surface-dark rounded-lg p-6 mb-8 border border-white/10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Date Range</label>
            <select
              v-model="filters.dateRange"
              class="w-full px-4 py-2 bg-surface-darker rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Client</label>
            <select
              v-model="filters.clientId"
              class="w-full px-4 py-2 bg-surface-darker rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Clients</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Report Type</label>
            <select
              v-model="filters.reportType"
              class="w-full px-4 py-2 bg-surface-darker rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="productivity">Productivity Report</option>
              <option value="sla">SLA Compliance</option>
              <option value="volume">Volume Analysis</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="generateReport"
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
        </div>
      </div>

      <!-- Report Content -->
      <div v-if="reportData.length > 0" class="bg-surface-dark rounded-lg overflow-hidden border border-white/10">
        <div class="px-6 py-4 border-b border-white/10">
          <h2 class="text-lg font-medium text-white">{{ reportTitle }}</h2>
        </div>

        <!-- Productivity Report -->
        <div v-if="filters.reportType === 'productivity'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-white/10">
            <thead>
              <tr class="bg-surface-darker">
                <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Employee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Total Jobs</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Avg Processing Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">SLA Compliance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Late Shipments</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="item in reportData" :key="item.employeeId" class="hover:bg-surface-darker/50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ item.employeeId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ item.totalJobs }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ item.avgProcessingTime }}h</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm text-white mr-2">{{ item.slaComplianceRate }}%</span>
                    <div class="w-24 bg-surface-darker rounded-full h-2">
                      <div
                        class="h-2 rounded-full"
                        :class="getSLAColor(item.slaComplianceRate)"
                        :style="{ width: `${item.slaComplianceRate}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ item.lateShipments }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Export Options -->
        <div class="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            @click="exportReport('csv')"
            class="px-4 py-2 bg-surface-darker hover:bg-surface-dark text-white rounded-lg transition-colors flex items-center gap-2"
          >
            Export CSV
          </button>
          <button
            @click="exportReport('pdf')"
            class="px-4 py-2 bg-surface-darker hover:bg-surface-dark text-white rounded-lg transition-colors flex items-center gap-2"
          >
            Export PDF
          </button>
        </div>
      </div>

      <!-- No Data State -->
      <div
        v-else
        class="bg-surface-dark rounded-lg p-8 border border-white/10 flex flex-col items-center justify-center text-center"
      >
        <svg class="w-12 h-12 text-white/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">No Report Data</h3>
        <p class="text-white/60">Select your filters and generate a report to view data</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

interface ReportFilters {
  dateRange: string
  clientId: string
  reportType: string
}

interface ProductivityData {
  employeeId: string
  totalJobs: number
  avgProcessingTime: number
  slaComplianceRate: number
  lateShipments: number
}

// Mock clients data
const clients = ref([
  { id: 'C0001', name: 'Acme Corp' },
  { id: 'C0002', name: 'TechStart Inc' },
  { id: 'C0003', name: 'Global Industries' }
])

const filters = ref<ReportFilters>({
  dateRange: 'week',
  clientId: '',
  reportType: 'productivity'
})

const reportData = ref<ProductivityData[]>([])

const reportTitle = computed(() => {
  const type = filters.value.reportType.charAt(0).toUpperCase() + filters.value.reportType.slice(1)
  const range = filters.value.dateRange.charAt(0).toUpperCase() + filters.value.dateRange.slice(1)
  return `${type} Report - ${range}`
})

const generateReport = async () => {
  // Mock data generation
  reportData.value = [
    {
      employeeId: 'EMP001',
      totalJobs: 45,
      avgProcessingTime: 1.5,
      slaComplianceRate: 95,
      lateShipments: 2
    },
    {
      employeeId: 'EMP002',
      totalJobs: 38,
      avgProcessingTime: 1.8,
      slaComplianceRate: 89,
      lateShipments: 4
    },
    {
      employeeId: 'EMP003',
      totalJobs: 52,
      avgProcessingTime: 1.2,
      slaComplianceRate: 98,
      lateShipments: 1
    }
  ]
}

const getSLAColor = (rate: number) => {
  if (rate >= 95) return 'bg-success'
  if (rate >= 85) return 'bg-warning'
  return 'bg-error'
}

const exportReport = (format: 'csv' | 'pdf') => {
  // Mock export functionality
  console.log(`Exporting report in ${format} format`)
}
</script> 