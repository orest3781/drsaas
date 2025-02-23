<template>
  <div :class="[
    'border-l-4 rounded-lg p-4',
    getStatusClasses()
  ]">
    <div class="flex justify-between items-start">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-white">{{ job.id }}</span>
        <span :class="[
          'px-2 py-1 text-xs font-medium rounded-full',
          `bg-${getPriorityColor()}-100 text-${getPriorityColor()}-800`
        ]">
          {{ job.priority }}
        </span>
        <!-- Hold Badge -->
        <span v-if="job.status === 'hold'" 
          class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 cursor-help"
          @mouseenter="showHoldReason = true"
          @mouseleave="showHoldReason = false"
        >
          On Hold
          <!-- Tooltip for hold reason -->
          <div v-if="showHoldReason" class="absolute mt-2 px-3 py-2 bg-surface-darker text-white text-xs rounded shadow-lg border border-white/10 z-10">
            {{ getHoldTooltip }}
          </div>
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Hold Button -->
        <button
          v-if="job.status !== 'hold' && job.status !== 'complete'"
          @click="showHoldModal = true"
          class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-500/10 focus:outline-none transition-colors"
          title="Place on Hold"
        >
          <PauseIcon class="h-5 w-5" />
        </button>
        <!-- Resume Button -->
        <button
          v-if="job.status === 'hold'"
          @click="resumeJob"
          class="p-2 rounded-lg text-green-500 hover:bg-green-500/10 focus:outline-none transition-colors"
          title="Resume Job"
        >
          <PlayIcon class="h-5 w-5" />
        </button>
        <button class="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 focus:outline-none transition-colors">
          <EllipsisVerticalIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <h3 class="mt-2 text-lg font-medium text-white">{{ job.title }}</h3>
    <p class="mt-1 text-sm text-white/60">{{ job.company }}</p>

    <div class="mt-4">
      <div class="flex items-center space-x-2">
        <div class="flex -space-x-2">
          <template v-for="user in job.team" :key="user.id">
            <img
              :src="user.avatar"
              :alt="user.name"
              class="h-6 w-6 rounded-full border-2 border-surface-darker"
              :title="user.name"
            />
          </template>
        </div>
        <div class="flex items-center space-x-2 text-sm text-white/60">
          <component :is="getStatusIcon()" class="h-4 w-4" />
          <span>{{ job.status }}</span>
          <span>·</span>
          <span>{{ job.timeElapsed }}</span>
        </div>
      </div>
    </div>

    <div v-if="isActive" class="mt-4">
      <div class="w-full bg-surface-darker rounded-full h-1.5">
        <div
          class="h-1.5 rounded-full"
          :class="getProgressClasses()"
          :style="{ width: `${job.progress}%` }"
        ></div>
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
            <div class="mt-1 text-white font-medium">{{ job.status.charAt(0).toUpperCase() + job.status.slice(1) }}</div>
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
              Expected Resolution Date
            </label>
            <input
              v-model="holdForm.expectedResolution"
              type="date"
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              :min="today"
            />
          </div>

          <!-- Contact Information -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">
              Contact Information for Follow-up
            </label>
            <input
              v-model="holdForm.contactInfo"
              type="text"
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
import { 
  EllipsisVerticalIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/vue/24/solid'
import {
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseCircleIcon
} from '@heroicons/vue/24/outline'
import Modal from './Modal.vue'

interface User {
  id: number
  name: string
  avatar: string
}

interface Job {
  id: string
  title: string
  company: string
  priority: 'urgent' | 'high' | 'normal'
  status: 'prep' | 'scanning' | 'qc' | 'hold' | 'complete'
  progress: number
  timeElapsed: string
  team: User[]
  holdInfo?: {
    reason: string
    reasonType: 'client_clarification' | 'missing_info' | 'technical_issue' | 'quality_concern' | 'other'
    expectedResolution: string
    contactInfo: string
    timestamp: string
    previousStatus: 'prep' | 'scanning' | 'qc'
  }
}

const props = defineProps<{
  job: Job
  isActive: boolean
}>()

const emit = defineEmits(['update:job'])

const showHoldModal = ref(false)
const showHoldReason = ref(false)
const holdForm = ref({
  reasonType: '',
  reason: '',
  expectedResolution: '',
  contactInfo: ''
})

const getStatusClasses = () => {
  if (props.job.status === 'hold') {
    return 'bg-surface-darker border-yellow-500'
  }
  return props.isActive 
    ? `bg-surface-darker border-${getPriorityColor()}-500` 
    : 'bg-surface-darker border-gray-600 opacity-75'
}

const getProgressClasses = () => {
  if (props.job.status === 'hold') {
    return 'bg-yellow-500'
  }
  return `bg-${getPriorityColor()}-500`
}

const getPriorityColor = () => {
  switch (props.job.priority) {
    case 'urgent':
      return 'red'
    case 'high':
      return 'yellow'
    default:
      return 'green'
  }
}

const getStatusIcon = () => {
  switch (props.job.status) {
    case 'prep':
      return ClockIcon
    case 'scanning':
      return ArrowPathIcon
    case 'qc':
      return ExclamationCircleIcon
    case 'hold':
      return PauseCircleIcon
    case 'complete':
      return CheckCircleIcon
    default:
      return ClockIcon
  }
}

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
      timestamp: new Date().toISOString(),
      previousStatus: props.job.status as 'prep' | 'scanning' | 'qc'
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

const resumeJob = () => {
  const updatedJob = {
    ...props.job,
    status: props.job.holdInfo?.previousStatus || 'prep',
    holdInfo: undefined
  }
  emit('update:job', updatedJob)
}

const getHoldTooltip = computed(() => {
  if (!props.job.holdInfo) return ''
  
  const timestamp = new Date(props.job.holdInfo.timestamp).toLocaleString()
  const resolutionDate = new Date(props.job.holdInfo.expectedResolution).toLocaleDateString()
  
  return `Type: ${props.job.holdInfo.reasonType.replace('_', ' ').toUpperCase()}
Reason: ${props.job.holdInfo.reason}
Contact: ${props.job.holdInfo.contactInfo}
Expected Resolution: ${resolutionDate}
Paused at: ${timestamp}`
})

const getReasonPlaceholder = computed(() => {
  switch (holdForm.value.reasonType) {
    case 'client_clarification':
      return 'Enter details for awaiting client clarification...'
    case 'missing_info':
      return 'Enter details for missing information...'
    case 'technical_issue':
      return 'Enter details for a technical issue...'
    case 'quality_concern':
      return 'Enter details for a quality concern...'
    case 'other':
      return 'Enter details for other reasons...'
    default:
      return ''
  }
})

const today = new Date().toISOString().split('T')[0]
const isHoldFormValid = computed(() => {
  return holdForm.value.reasonType && holdForm.value.reason && holdForm.value.expectedResolution && holdForm.value.contactInfo
})
</script> 