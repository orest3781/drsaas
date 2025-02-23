<template>
  <div class="inline-flex">
    <!-- Hold Button -->
    <button
      v-if="canManageHold && !isOnHold"
      @click.stop="showHoldModal = true"
      class="p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-500/10 focus:outline-none transition-colors"
      title="Place on Hold"
    >
      <PauseCircleIcon class="h-5 w-5" />
    </button>

    <!-- Resume Button -->
    <button
      v-if="canManageHold && isOnHold"
      @click.stop="handleResume"
      class="p-1.5 rounded-lg text-green-500 hover:bg-green-500/10 focus:outline-none transition-colors"
      title="Resume Job"
    >
      <PlayIcon class="h-5 w-5" />
    </button>

    <!-- Hold Modal -->
    <Modal v-if="showHoldModal" @close="showHoldModal = false">
      <template #title>
        <div class="flex items-center space-x-2">
          <PauseCircleIcon class="h-5 w-5 text-yellow-500" />
          <span>Place Job on Hold</span>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleHold" class="space-y-4">
          <!-- Current Status -->
          <div class="bg-surface-dark/50 rounded-lg p-4 border border-white/10">
            <div class="text-sm text-white/60">Current Status</div>
            <div class="mt-1 text-white font-medium">{{ currentStatus }}</div>
          </div>

          <!-- Hold Reason -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">
              Reason for Hold <span class="text-error">*</span>
            </label>
            <select
              v-model="holdForm.reasonType"
              required
              class="w-full px-4 py-2 mb-3 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select reason type...</option>
              <option value="client_clarification">Awaiting Client Clarification</option>
              <option value="missing_info">Missing Information</option>
              <option value="technical_issue">Technical Issue</option>
              <option value="quality_concern">Quality Concern</option>
              <option value="other">Other</option>
            </select>
            <textarea
              v-model="holdForm.reason"
              rows="3"
              required
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              :placeholder="getReasonPlaceholder"
            ></textarea>
          </div>

          <!-- Expected Resolution -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">
              Expected Resolution Date <span class="text-error">*</span>
            </label>
            <input
              v-model="holdForm.expectedResolution"
              type="date"
              required
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              :min="today"
            />
          </div>

          <!-- Contact Information -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">
              Contact Information for Follow-up <span class="text-error">*</span>
            </label>
            <input
              v-model="holdForm.contactInfo"
              type="text"
              required
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Name, email, or phone number for follow-up"
            />
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-sm text-white/60">
            <span class="text-error">*</span> Required fields
          </div>
          <div class="flex space-x-3">
            <button
              @click="showHoldModal = false"
              class="px-4 py-2 bg-surface-dark hover:bg-surface-dark/80 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleHold"
              class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              :disabled="!isHoldFormValid"
            >
              <PauseIcon class="h-4 w-4" />
              <span>Place on Hold</span>
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { 
  PauseCircleIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/vue/24/outline'
import Modal from './Modal.vue'

interface Props {
  isOnHold: boolean
  currentStatus: string
}

const props = defineProps<Props>()
const emit = defineEmits(['hold', 'resume'])

const authStore = useAuthStore()
const showHoldModal = ref(false)

const holdForm = ref({
  reasonType: '',
  reason: '',
  expectedResolution: '',
  contactInfo: ''
})

// Only allow supervisors and admins to manage hold status
const canManageHold = computed(() => {
  return authStore.isAdmin || authStore.isSupervisor
})

const getReasonPlaceholder = computed(() => {
  switch (holdForm.value.reasonType) {
    case 'client_clarification':
      return 'Enter details about the client clarification needed...'
    case 'missing_info':
      return 'Specify what information is missing...'
    case 'technical_issue':
      return 'Describe the technical issue...'
    case 'quality_concern':
      return 'Explain the quality concern...'
    case 'other':
      return 'Enter reason details...'
    default:
      return ''
  }
})

const today = new Date().toISOString().split('T')[0]

const isHoldFormValid = computed(() => {
  return holdForm.value.reasonType && 
         holdForm.value.reason && 
         holdForm.value.expectedResolution && 
         holdForm.value.contactInfo
})

const handleHold = () => {
  if (!isHoldFormValid.value) return

  emit('hold', {
    reasonType: holdForm.value.reasonType,
    reason: holdForm.value.reason,
    expectedResolution: holdForm.value.expectedResolution,
    contactInfo: holdForm.value.contactInfo,
    timestamp: new Date().toISOString()
  })

  showHoldModal.value = false
  holdForm.value = {
    reasonType: '',
    reason: '',
    expectedResolution: '',
    contactInfo: ''
  }
}

const handleResume = () => {
  emit('resume')
}
</script> 