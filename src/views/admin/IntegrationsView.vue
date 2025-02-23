<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-white">Integrations</h2>
        <p class="text-white/60">Manage third-party service integrations</p>
      </div>
      <button
        @click="showAddIntegrationModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Integration
      </button>
    </div>

    <!-- Integrations Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="integration in integrations" :key="integration.id" 
           class="bg-surface-darker rounded-lg border border-white/10 p-6 hover:border-white/20 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <h3 class="text-lg font-medium text-white">{{ integration.name }}</h3>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                integration.status === 'connected' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
              ]">
                {{ integration.status }}
              </span>
            </div>
            <p class="mt-1 text-sm text-white/60">{{ integration.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              v-if="integration.status === 'connected'"
              @click="configureIntegration(integration)"
              class="text-white/60 hover:text-white transition-colors"
              title="Configure"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button
              @click="toggleIntegration(integration)"
              class="text-white/60 hover:text-white transition-colors"
              :title="integration.status === 'connected' ? 'Disconnect' : 'Connect'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="integration.status === 'connected'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <!-- Integration Details -->
          <div class="bg-surface-dark rounded-lg p-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-white/60">API Version</span>
                <span class="text-white">{{ integration.apiVersion }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-white/60">Last Sync</span>
                <span class="text-white">{{ integration.lastSync || 'Never' }}</span>
              </div>
            </div>
          </div>

          <!-- Integration Stats -->
          <div class="bg-surface-dark rounded-lg p-4">
            <h4 class="text-sm font-medium text-white/80 mb-2">Statistics</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-white/60">API Calls</div>
                <div class="text-lg font-medium text-white">{{ integration.stats.apiCalls }}</div>
              </div>
              <div>
                <div class="text-sm text-white/60">Success Rate</div>
                <div class="text-lg font-medium text-white">{{ integration.stats.successRate }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Configure Integration Modal -->
    <div
      v-if="showAddIntegrationModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-surface-dark rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-white mb-4">
          {{ editingIntegration ? 'Configure Integration' : 'Add New Integration' }}
        </h3>
        <form @submit.prevent="saveIntegration" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Integration Name</label>
            <input
              v-model="integrationForm.name"
              type="text"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">API Key</label>
            <input
              v-model="integrationForm.apiKey"
              type="password"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">API Endpoint</label>
            <input
              v-model="integrationForm.endpoint"
              type="text"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Description</label>
            <textarea
              v-model="integrationForm.description"
              rows="2"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddIntegrationModal = false"
              class="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              {{ editingIntegration ? 'Save Changes' : 'Add Integration' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface IntegrationStats {
  apiCalls: number
  successRate: number
}

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected'
  apiVersion: string
  lastSync: string | null
  stats: IntegrationStats
}

// State
const showAddIntegrationModal = ref(false)
const editingIntegration = ref<Integration | null>(null)
const integrationForm = ref({
  name: '',
  apiKey: '',
  endpoint: '',
  description: ''
})

// Mock data
const integrations = ref<Integration[]>([
  {
    id: '1',
    name: 'Document Storage API',
    description: 'Cloud storage integration for document management',
    status: 'connected',
    apiVersion: 'v2.1.0',
    lastSync: '2024-03-15 10:30:00',
    stats: {
      apiCalls: 1234,
      successRate: 99.8
    }
  },
  {
    id: '2',
    name: 'OCR Service',
    description: 'Optical character recognition service integration',
    status: 'connected',
    apiVersion: 'v1.5.2',
    lastSync: '2024-03-15 11:15:00',
    stats: {
      apiCalls: 856,
      successRate: 98.5
    }
  },
  {
    id: '3',
    name: 'Email Service',
    description: 'Email notification service integration',
    status: 'disconnected',
    apiVersion: 'v3.0.0',
    lastSync: null,
    stats: {
      apiCalls: 0,
      successRate: 0
    }
  }
])

// Methods
const configureIntegration = (integration: Integration) => {
  editingIntegration.value = integration
  integrationForm.value = {
    name: integration.name,
    apiKey: '********', // Placeholder for security
    endpoint: 'https://api.example.com/v1', // Placeholder
    description: integration.description
  }
  showAddIntegrationModal.value = true
}

const toggleIntegration = (integration: Integration) => {
  integration.status = integration.status === 'connected' ? 'disconnected' : 'connected'
  if (integration.status === 'disconnected') {
    integration.lastSync = null
  } else {
    integration.lastSync = new Date().toISOString()
  }
}

const saveIntegration = () => {
  if (editingIntegration.value) {
    // Update existing integration
    const integration = integrations.value.find(i => i.id === editingIntegration.value?.id)
    if (integration) {
      integration.name = integrationForm.value.name
      integration.description = integrationForm.value.description
      // In a real app, you would also update the API key and endpoint if changed
    }
  } else {
    // Add new integration
    const newId = String(integrations.value.length + 1)
    integrations.value.push({
      id: newId,
      name: integrationForm.value.name,
      description: integrationForm.value.description,
      status: 'disconnected',
      apiVersion: 'v1.0.0',
      lastSync: null,
      stats: {
        apiCalls: 0,
        successRate: 0
      }
    })
  }
  showAddIntegrationModal.value = false
  editingIntegration.value = null
  integrationForm.value = {
    name: '',
    apiKey: '',
    endpoint: '',
    description: ''
  }
}
</script> 