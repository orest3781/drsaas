<template>
  <div class="bg-surface-darker rounded-lg overflow-hidden border border-white/10">
    <!-- Header -->
    <div class="p-4">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-lg font-medium text-white">{{ job.company }}</h3>
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getStatusBadgeClasses()
            ]">
              {{ getStatusText() }}
            </span>
          </div>
          <h4 class="text-white/60 mt-1">{{ job.title }}</h4>
          <div class="text-sm font-mono text-white/40 mt-1">{{ job.id }}</div>
        </div>
        
        <!-- Action Buttons -->
        <div class="absolute top-4 right-4">
          <HoldButton
            :is-on-hold="job.status === 'hold'"
            :current-status="job.currentStep"
            @hold="handleHold"
            @resume="handleResume"
          />
        </div>
      </div>

      <!-- Hold Message -->
      <div v-if="job.status === 'hold'" class="mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <div class="flex items-start space-x-2">
          <InformationCircleIcon class="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <div class="text-yellow-500 text-sm font-medium">On Hold</div>
            <div class="text-white/60 text-sm">{{ job.holdInfo?.reason }}</div>
            <div class="text-white/40 text-xs mt-1">
              Expected resolution: {{ formatDate(job.holdInfo?.expectedResolution) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="px-4 pb-4 space-y-2">
      <div v-for="step in steps" :key="step.name" class="flex items-center">
        <div class="w-16 text-xs font-medium text-white/60">{{ step.name }}</div>
        <div class="flex-1 ml-4">
          <div class="relative">
            <div class="h-2 bg-surface-dark rounded">
              <div
                v-if="step.progress > 0"
                class="h-2 rounded transition-all duration-300"
                :class="getProgressBarClasses(step)"
                :style="{ width: `${step.progress}%` }"
              ></div>
            </div>
          </div>
        </div>
        <div class="ml-4 flex items-center space-x-2">
          <span v-if="step.operator" class="text-xs text-white/40">{{ step.operator }}</span>
          <span v-if="step.time" class="text-xs text-white/40">{{ step.time }}</span>
        </div>
      </div>
    </div>

    <!-- Current Status -->
    <div class="px-4 py-3 bg-surface-dark/50 border-t border-white/10">
      <div class="flex justify-between items-center">
        <div>
          <div class="text-sm text-white/60">Current Operator</div>
          <div class="text-sm font-medium text-white">{{ job.currentOperator }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-white/60">Current Step</div>
          <div class="text-sm font-medium text-white">{{ job.currentStep }}</div>
        </div>
      </div>
    </div>

    <!-- Hold Modal -->
    <Modal v-if="showHoldModal" @close="showHoldModal = false">
      <template #title>
        <div class="flex items-center space-x-2">
          <PauseCircleIcon class="h-5 w-5 text-yellow-500" />
          <span>Place Job on Hold</span>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="placeOnHold" class="space-y-6">
          <!-- Current Status -->
          <div class="bg-surface-dark/50 rounded-lg p-4 border border-white/10">
            <div class="text-sm text-white/60">Current Status</div>
            <div class="mt-1 text-white font-medium">{{ job.currentStep }}</div>
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
              @click="placeOnHold"
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
  PauseIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import Modal from './Modal.vue'
import HoldButton from './HoldButton.vue'

interface Step {
  name: string
  progress: number
  operator?: string
  time?: string
}

interface Job {
  id: string
  company: string
  title: string
  status: 'in_progress' | 'urgent' | 'hold' | 'complete'
  currentOperator: string
  currentStep: string
  steps: Step[]
  holdInfo?: {
    reason: string
    reasonType: 'client_clarification' | 'missing_info' | 'technical_issue' | 'quality_concern' | 'other'
    expectedResolution: string
    contactInfo: string
    timestamp: string
  }
}

const props = defineProps<{
  job: Job
}>()

const emit = defineEmits(['update:job'])

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

const getStatusText = () => {
  switch (props.job.status) {
    case 'urgent':
      return 'Urgent'
    case 'hold':
      return 'On Hold'
    case 'complete':
      return 'Complete'
    default:
      return 'In Progress'
  }
}

const getStatusBadgeClasses = () => {
  switch (props.job.status) {
    case 'urgent':
      return 'bg-error/20 text-error'
    case 'hold':
      return 'bg-yellow-500/20 text-yellow-500'
    case 'complete':
      return 'bg-success/20 text-success'
    default:
      return 'bg-primary/20 text-primary'
  }
}

const getProgressBarClasses = (step: Step) => {
  if (props.job.status === 'hold') {
    return 'bg-yellow-500/50'
  }
  if (props.job.status === 'urgent') {
    return 'bg-error'
  }
  return 'bg-primary'
}

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

const placeOnHold = () => {
  if (!isHoldFormValid.value) return

  const updatedJob = {
    ...props.job,
    status: 'hold',
    holdInfo: {
      reason: holdForm.value.reason,
      reasonType: holdForm.value.reasonType,
      expectedResolution: holdForm.value.expectedResolution,
      contactInfo: holdForm.value.contactInfo,
      timestamp: new Date().toISOString()
    }
  }
  emit('update:job', updatedJob)
  showHoldModal.value = false
  holdForm.value = {
    reasonType: '',
    reason: '',
    expectedResolution: '',
    contactInfo: ''
  }
}

const handleHold = (holdInfo) => {
  const updatedJob = {
    ...props.job,
    status: 'hold',
    holdInfo: {
      ...holdInfo,
      previousStatus: props.job.status
    }
  }
  emit('update:job', updatedJob)
}

const handleResume = () => {
  const updatedJob = {
    ...props.job,
    status: props.job.holdInfo?.previousStatus || 'in_progress',
    holdInfo: undefined
  }
  emit('update:job', updatedJob)
}

const formatDate = (date?: string) => {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString()
}
</script> 