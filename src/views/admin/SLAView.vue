<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-white">SLA Configuration</h2>
        <p class="text-white/60">Manage service level agreements and processing time requirements</p>
      </div>
      <button
        @click="showAddSLAModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add SLA Policy
      </button>
    </div>

    <!-- SLA Policies Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="policy in slaPolicies" :key="policy.id" 
           class="bg-surface-darker rounded-lg border border-white/10 p-6 hover:border-white/20 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <h3 class="text-lg font-medium text-white">{{ policy.name }}</h3>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                policy.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
              ]">
                {{ policy.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <p class="mt-1 text-sm text-white/60">{{ policy.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="togglePolicy(policy)"
              class="text-white/60 hover:text-white transition-colors"
              :title="policy.active ? 'Deactivate' : 'Activate'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </button>
            <button
              @click="editPolicy(policy)"
              class="text-white/60 hover:text-white transition-colors"
              title="Edit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="deletePolicy(policy.id)"
              class="text-white/60 hover:text-error transition-colors"
              title="Delete"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <!-- Processing Times -->
          <div class="bg-surface-dark rounded-lg p-4">
            <h4 class="text-sm font-medium text-white/80 mb-2">Processing Times</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-white/60">Standard</span>
                <span class="text-white">{{ policy.processingTimes.standard }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-white/60">Urgent</span>
                <span class="text-white">{{ policy.processingTimes.urgent }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-white/60">Priority</span>
                <span class="text-white">{{ policy.processingTimes.priority }}</span>
              </div>
            </div>
          </div>

          <!-- Escalation Rules -->
          <div class="bg-surface-dark rounded-lg p-4">
            <h4 class="text-sm font-medium text-white/80 mb-2">Escalation Rules</h4>
            <div class="space-y-2">
              <div v-for="(rule, index) in policy.escalationRules" :key="index"
                   class="text-sm text-white/60">
                {{ rule }}
              </div>
            </div>
          </div>

          <!-- Applied To -->
          <div class="bg-surface-dark rounded-lg p-4">
            <h4 class="text-sm font-medium text-white/80 mb-2">Applied To</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="client in policy.appliedTo"
                :key="client"
                class="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary"
              >
                {{ client }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit SLA Modal -->
    <div
      v-if="showAddSLAModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-surface-dark rounded-lg p-6 w-full max-w-xl">
        <h3 class="text-lg font-medium text-white mb-4">
          {{ editingPolicy ? 'Edit SLA Policy' : 'Add New SLA Policy' }}
        </h3>
        <form @submit.prevent="savePolicy" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Policy Name</label>
            <input
              v-model="policyForm.name"
              type="text"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Description</label>
            <textarea
              v-model="policyForm.description"
              rows="2"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            ></textarea>
          </div>

          <!-- Processing Times -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Processing Times</label>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-24 text-sm text-white/60">Standard</span>
                <input
                  v-model="policyForm.processingTimes.standard"
                  type="text"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                  placeholder="e.g., 48h"
                  required
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 text-sm text-white/60">Urgent</span>
                <input
                  v-model="policyForm.processingTimes.urgent"
                  type="text"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                  placeholder="e.g., 24h"
                  required
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 text-sm text-white/60">Priority</span>
                <input
                  v-model="policyForm.processingTimes.priority"
                  type="text"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                  placeholder="e.g., 36h"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Escalation Rules -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Escalation Rules</label>
            <div class="space-y-2">
              <div v-for="(rule, index) in policyForm.escalationRules" :key="index"
                   class="flex items-center gap-2">
                <input
                  v-model="policyForm.escalationRules[index]"
                  type="text"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                  placeholder="Enter escalation rule"
                />
                <button
                  type="button"
                  @click="removeEscalationRule(index)"
                  class="text-white/60 hover:text-error transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addEscalationRule"
              class="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Add Escalation Rule
            </button>
          </div>

          <!-- Applied To -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Applied To</label>
            <div class="space-y-2">
              <div v-for="(client, index) in policyForm.appliedTo" :key="index"
                   class="flex items-center gap-2">
                <input
                  v-model="policyForm.appliedTo[index]"
                  type="text"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                  placeholder="Enter client name"
                />
                <button
                  type="button"
                  @click="removeClient(index)"
                  class="text-white/60 hover:text-error transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addClient"
              class="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Add Client
            </button>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddSLAModal = false"
              class="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              {{ editingPolicy ? 'Save Changes' : 'Add Policy' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ProcessingTimes {
  standard: string
  urgent: string
  priority: string
}

interface SLAPolicy {
  id: string
  name: string
  description: string
  active: boolean
  processingTimes: ProcessingTimes
  escalationRules: string[]
  appliedTo: string[]
}

// State
const showAddSLAModal = ref(false)
const editingPolicy = ref<SLAPolicy | null>(null)
const policyForm = ref({
  name: '',
  description: '',
  processingTimes: {
    standard: '',
    urgent: '',
    priority: ''
  },
  escalationRules: [] as string[],
  appliedTo: [] as string[]
})

// Mock data
const slaPolicies = ref<SLAPolicy[]>([
  {
    id: '1',
    name: 'Standard Medical Records',
    description: 'Default SLA policy for medical record processing',
    active: true,
    processingTimes: {
      standard: '48h',
      urgent: '24h',
      priority: '36h'
    },
    escalationRules: [
      'Notify supervisor at 75% of SLA time',
      'Escalate to manager at 90% of SLA time',
      'Alert client contact at SLA breach'
    ],
    appliedTo: [
      'MedFirst Healthcare',
      'Wellness Partners Group'
    ]
  },
  {
    id: '2',
    name: 'Priority Insurance Claims',
    description: 'Expedited processing for insurance documentation',
    active: true,
    processingTimes: {
      standard: '36h',
      urgent: '12h',
      priority: '24h'
    },
    escalationRules: [
      'Notify team lead at 50% of SLA time',
      'Escalate to supervisor at 75% of SLA time',
      'Alert management at SLA breach'
    ],
    appliedTo: [
      'Insurance Corp A',
      'Healthcare Provider B'
    ]
  }
])

// Methods
const togglePolicy = (policy: SLAPolicy) => {
  policy.active = !policy.active
}

const editPolicy = (policy: SLAPolicy) => {
  editingPolicy.value = policy
  policyForm.value = {
    name: policy.name,
    description: policy.description,
    processingTimes: { ...policy.processingTimes },
    escalationRules: [...policy.escalationRules],
    appliedTo: [...policy.appliedTo]
  }
  showAddSLAModal.value = true
}

const deletePolicy = (id: string) => {
  if (confirm('Are you sure you want to delete this SLA policy?')) {
    const index = slaPolicies.value.findIndex(p => p.id === id)
    if (index !== -1) {
      slaPolicies.value.splice(index, 1)
    }
  }
}

const addEscalationRule = () => {
  policyForm.value.escalationRules.push('')
}

const removeEscalationRule = (index: number) => {
  policyForm.value.escalationRules.splice(index, 1)
}

const addClient = () => {
  policyForm.value.appliedTo.push('')
}

const removeClient = (index: number) => {
  policyForm.value.appliedTo.splice(index, 1)
}

const savePolicy = () => {
  if (editingPolicy.value) {
    // Update existing policy
    const policy = slaPolicies.value.find(p => p.id === editingPolicy.value?.id)
    if (policy) {
      policy.name = policyForm.value.name
      policy.description = policyForm.value.description
      policy.processingTimes = { ...policyForm.value.processingTimes }
      policy.escalationRules = policyForm.value.escalationRules.filter(rule => rule.trim())
      policy.appliedTo = policyForm.value.appliedTo.filter(client => client.trim())
    }
  } else {
    // Add new policy
    const newId = String(slaPolicies.value.length + 1)
    slaPolicies.value.push({
      id: newId,
      name: policyForm.value.name,
      description: policyForm.value.description,
      active: true,
      processingTimes: { ...policyForm.value.processingTimes },
      escalationRules: policyForm.value.escalationRules.filter(rule => rule.trim()),
      appliedTo: policyForm.value.appliedTo.filter(client => client.trim())
    })
  }
  showAddSLAModal.value = false
  editingPolicy.value = null
  policyForm.value = {
    name: '',
    description: '',
    processingTimes: {
      standard: '',
      urgent: '',
      priority: ''
    },
    escalationRules: [],
    appliedTo: []
  }
}
</script> 