<template>
  <div class="min-h-screen bg-[#0f1729]">
    <AppHeader title="Dashboard" />

    <!-- Main Content -->
    <div class="p-6 board-gradient">
      <!-- 4 Column Grid with 4:3 Cards -->
      <div class="grid grid-cols-4 gap-6">
        <TransitionGroup name="job" tag="div" class="grid grid-cols-4 gap-6 col-span-4">
          <div v-for="job in activeJobs" :key="job.id" 
               :class="[
                 'relative bg-[#1e293b] rounded-lg overflow-hidden transition-all duration-500 border-2',
                 job.id === jobStore.recentlyCompleted ? 'scale-95 opacity-50 transform translate-x-[-100%]' : 
                 job.status === 'Urgent' ? 'border-error/40 hover:border-error/60' :
                 job.status === 'In Progress' ? 'border-primary/40 hover:border-primary/60' :
                 job.status === 'On Hold' ? 'border-warning/40 hover:border-warning/60' :
                 job.status === 'Completed' ? 'border-success/40 hover:border-success/60' :
                 'border-white/10 hover:border-white/20'
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
                  <template v-if="shouldShowProgress(job.steps[step], index, job.steps)">
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
                  </template>
                  <template v-else>
                    <div class="flex-1 text-white/40 text-[10px] relative">
                      <span class="inline-block pending-text">Pending {{ getPreviousStepName(index) }}</span>
                    </div>
                    <div class="w-8"></div>
                  </template>
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
                <!-- Hold Message -->
                <div v-if="job.status === 'On Hold'" class="mb-2 p-3 bg-warning/10 border border-warning/20 rounded-lg min-h-[60px]">
                  <div class="text-warning/80 text-xs space-y-1">
                    <div class="font-medium">On Hold</div>
                    <div class="leading-relaxed">{{ job.holdReason || 'No reason provided' }}</div>
                  </div>
                </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useJobStore } from '../stores/jobs'
import type { Job } from '../types'
import AppHeader from '../components/AppHeader.vue'

const jobStore = useJobStore()
const { activeJobs } = storeToRefs(jobStore)

const currentDate = ref(new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

const workflowSteps = ['PREP', 'SCAN', 'QC', 'INDEX', 'REPREP']

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('')
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Urgent':
      return 'status-urgent'
    case 'In Progress':
      return 'status-in-progress'
    case 'On Hold':
      return 'status-on-hold'
    case 'Completed':
      return 'status-completed'
    default:
      return 'text-white/60 bg-white/10'
  }
}

const formatElapsedTime = (timestamp: string | null): string => {
  if (!timestamp) return ''
  const now = new Date()
  const updated = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else {
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h${minutes}m ago`
  }
}

const getProgressBarColor = (step: { progress: number, lastUpdated: string | null }): string => {
  if (!step.lastUpdated) return 'bg-primary'
  
  const now = new Date()
  const lastUpdated = new Date(step.lastUpdated)
  const hoursElapsed = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)
  
  if (hoursElapsed <= 1) return 'bg-success'
  if (hoursElapsed <= 2) return 'bg-warning'
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

const shouldShowProgress = (step: any, index: number, allSteps: any): boolean => {
  if (index === 0) return true // First step always shows progress
  
  // Check if previous step is completed
  const prevStep = allSteps[workflowSteps[index - 1]]
  return prevStep && prevStep.progress === 100
}

const getPreviousStepName = (index: number): string => {
  if (index === 0) return ''
  return workflowSteps[index - 1]
}

const isJobReadyToComplete = (job: Job): boolean => {
  // Check if all steps are at 100%
  return Object.values(job.steps).every(step => step.progress === 100)
}

const completeJob = (jobId: number) => {
  jobStore.completeJob(jobId)
}

const activeProjects = computed(() => {
  return clients.value.reduce((count, client) => {
    return count + client.projects.length
  }, 0)
})

const onHoldCount = computed(() => {
  return activeJobs.value.filter(job => job.status === 'On Hold').length
})

const onHoldProjectsCount = computed(() => {
  return new Set(activeJobs.value
    .filter(job => job.status === 'On Hold')
    .map(job => job.projectId)).size
})

// Mock data (replace with actual data from your store)
const clients = ref<Client[]>([
  {
    id: 'C0001',
    name: 'MedFirst Healthcare',
    hasUrgent: true,
    totalBoxes: 45,
    projects: [
      {
        id: 'C0001P001',
        name: 'Patient Records 2023',
        sla: '24h',
        deadline: '2024-03-20',
        shipments: generateShipments(45, true)
      }
    ]
  },
  {
    id: 'C0002',
    name: 'Wellness Partners Group',
    hasUrgent: false,
    totalBoxes: 23,
    projects: [
      {
        id: 'C0002P001',
        name: 'Insurance Claims Q1',
        sla: '48h',
        deadline: '2024-03-25',
        shipments: generateShipments(12)
      },
      {
        id: 'C0002P002',
        name: 'Staff Records Update',
        sla: '72h',
        deadline: '2024-03-28',
        shipments: generateShipments(11)
      }
    ]
  },
  {
    id: 'C0003',
    name: 'Vitality Medical Center',
    hasUrgent: true,
    totalBoxes: 67,
    projects: [
      {
        id: 'C0003P001',
        name: 'Emergency Records',
        sla: '24h',
        deadline: '2024-03-19',
        shipments: generateShipments(35, true)
      },
      {
        id: 'C0003P002',
        name: 'Radiology Archives',
        sla: '48h',
        deadline: '2024-03-22',
        shipments: generateShipments(32)
      }
    ]
  },
  {
    id: 'C0004',
    name: 'LifeCare Solutions',
    hasUrgent: false,
    totalBoxes: 15,
    projects: [
      {
        id: 'C0004P001',
        name: 'Annual Compliance',
        sla: '72h',
        deadline: '2024-03-30',
        shipments: generateShipments(15)
      }
    ]
  },
  {
    id: 'C0005',
    name: 'Healing Hands Hospital',
    hasUrgent: true,
    totalBoxes: 78,
    projects: [
      {
        id: 'C0005P001',
        name: 'Surgery Records 2023',
        sla: '24h',
        deadline: '2024-03-21',
        shipments: generateShipments(40, true)
      },
      {
        id: 'C0005P002',
        name: 'Patient Discharge Files',
        sla: '48h',
        deadline: '2024-03-23',
        shipments: generateShipments(38)
      }
    ]
  },
  {
    id: 'C0006',
    name: 'CarePlus Network',
    hasUrgent: false,
    totalBoxes: 34,
    projects: [
      {
        id: 'C0006P001',
        name: 'Provider Documentation',
        sla: '48h',
        deadline: '2024-03-24',
        shipments: generateShipments(34)
      }
    ]
  },
  {
    id: 'C0007',
    name: 'Serenity Health Services',
    hasUrgent: true,
    totalBoxes: 56,
    projects: [
      {
        id: 'C0007P001',
        name: 'Mental Health Records',
        sla: '24h',
        deadline: '2024-03-20',
        shipments: generateShipments(30, true)
      },
      {
        id: 'C0007P002',
        name: 'Outpatient Files',
        sla: '72h',
        deadline: '2024-03-25',
        shipments: generateShipments(26)
      }
    ]
  },
  {
    id: 'C0008',
    name: 'Guardian Medical Group',
    hasUrgent: false,
    totalBoxes: 42,
    projects: [
      {
        id: 'C0008P001',
        name: 'Family Practice Records',
        sla: '48h',
        deadline: '2024-03-22',
        shipments: generateShipments(42)
      }
    ]
  },
  {
    id: 'C0009',
    name: 'Pinnacle Healthcare',
    hasUrgent: true,
    totalBoxes: 65,
    projects: [
      {
        id: 'C0009P001',
        name: 'Urgent Care Files',
        sla: '24h',
        deadline: '2024-03-19',
        shipments: generateShipments(35, true)
      },
      {
        id: 'C0009P002',
        name: 'Administrative Records',
        sla: '72h',
        deadline: '2024-03-26',
        shipments: generateShipments(30)
      }
    ]
  },
  {
    id: 'C0010',
    name: 'Harmony Health Alliance',
    hasUrgent: false,
    totalBoxes: 28,
    projects: [
      {
        id: 'C0010P001',
        name: 'Patient Charts Q1',
        sla: '48h',
        deadline: '2024-03-23',
        shipments: generateShipments(28)
      }
    ]
  },
  {
    id: 'C0011',
    name: 'Evergreen Medical Center',
    hasUrgent: true,
    totalBoxes: 72,
    projects: [
      {
        id: 'C0011P001',
        name: 'Emergency Department',
        sla: '24h',
        deadline: '2024-03-20',
        shipments: generateShipments(40, true)
      },
      {
        id: 'C0011P002',
        name: 'Pediatrics Division',
        sla: '48h',
        deadline: '2024-03-24',
        shipments: generateShipments(32)
      }
    ]
  },
  {
    id: 'C0012',
    name: 'Unity Healthcare Partners',
    hasUrgent: false,
    totalBoxes: 19,
    projects: [
      {
        id: 'C0012P001',
        name: 'Quality Assurance Review',
        sla: '72h',
        deadline: '2024-03-28',
        shipments: generateShipments(19)
      }
    ]
  },
  {
    id: 'C0013',
    name: 'Coastal Wellness Center',
    hasUrgent: true,
    totalBoxes: 48,
    projects: [
      {
        id: 'C0013P001',
        name: 'Patient Records Update',
        sla: '24h',
        deadline: '2024-03-21',
        shipments: generateShipments(25, true)
      },
      {
        id: 'C0013P002',
        name: 'Insurance Processing',
        sla: '48h',
        deadline: '2024-03-25',
        shipments: generateShipments(23)
      }
    ]
  },
  {
    id: 'C0014',
    name: 'Precision Medical Group',
    hasUrgent: false,
    totalBoxes: 31,
    projects: [
      {
        id: 'C0014P001',
        name: 'Laboratory Records',
        sla: '48h',
        deadline: '2024-03-23',
        shipments: generateShipments(31)
      }
    ]
  },
  {
    id: 'C0015',
    name: 'Summit Health Associates',
    hasUrgent: true,
    totalBoxes: 58,
    projects: [
      {
        id: 'C0015P001',
        name: 'Cardiology Department',
        sla: '24h',
        deadline: '2024-03-20',
        shipments: generateShipments(30, true)
      },
      {
        id: 'C0015P002',
        name: 'Outpatient Services',
        sla: '72h',
        deadline: '2024-03-27',
        shipments: generateShipments(28)
      }
    ]
  },
  {
    id: 'C0016',
    name: 'Riverside Medical Center',
    hasUrgent: false,
    totalBoxes: 25,
    projects: [
      {
        id: 'C0016P001',
        name: 'General Practice Files',
        sla: '48h',
        deadline: '2024-03-24',
        shipments: generateShipments(25)
      }
    ]
  },
  {
    id: 'C0017',
    name: 'Advanced Care Solutions',
    hasUrgent: true,
    totalBoxes: 63,
    projects: [
      {
        id: 'C0017P001',
        name: 'Specialist Records',
        sla: '24h',
        deadline: '2024-03-19',
        shipments: generateShipments(35, true)
      },
      {
        id: 'C0017P002',
        name: 'Administrative Files',
        sla: '48h',
        deadline: '2024-03-23',
        shipments: generateShipments(28)
      }
    ]
  },
  {
    id: 'C0018',
    name: 'Pacific Health Network',
    hasUrgent: false,
    totalBoxes: 37,
    projects: [
      {
        id: 'C0018P001',
        name: 'Quarterly Compliance',
        sla: '72h',
        deadline: '2024-03-29',
        shipments: generateShipments(37)
      }
    ]
  },
  {
    id: 'C0019',
    name: 'Integrated Medical Systems',
    hasUrgent: true,
    totalBoxes: 52,
    projects: [
      {
        id: 'C0019P001',
        name: 'Digital Conversion',
        sla: '24h',
        deadline: '2024-03-20',
        shipments: generateShipments(28, true)
      },
      {
        id: 'C0019P002',
        name: 'Archive Processing',
        sla: '48h',
        deadline: '2024-03-24',
        shipments: generateShipments(24)
      }
    ]
  },
  {
    id: 'C0020',
    name: 'Cornerstone Health Partners',
    hasUrgent: false,
    totalBoxes: 44,
    projects: [
      {
        id: 'C0020P001',
        name: 'Medical Records Audit',
        sla: '48h',
        deadline: '2024-03-25',
        shipments: generateShipments(44)
      }
    ]
  }
])

function generateShipments(count: number, hasUrgent: boolean = false): Shipment[] {
  const shipments: Shipment[] = []
  for (let i = 1; i <= count; i++) {
    shipments.push({
      id: `B${String(i).padStart(5, '0')}`,
      boxType: Math.random() > 0.3 ? 'Standard' : 'Long',
      receivedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      isUrgent: hasUrgent && i <= Math.ceil(count * 0.3) // 30% of boxes in urgent projects are marked urgent
    })
  }
  return shipments
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

.loading-dots-container {
  position: absolute;
  bottom: -4px;
  margin-left: 2px;
  display: inline-flex;
  gap: 2px;
}

.dot {
  width: 3px;
  height: 3px;
  background-color: rgb(255 255 255 / 0.4);
  border-radius: 50%;
  display: inline-block;
  opacity: 0;
}

.dot:nth-child(1) {
  animation: fadeDot 2s infinite;
}

.dot:nth-child(2) {
  animation: fadeDot 2s infinite 0.5s;
}

.dot:nth-child(3) {
  animation: fadeDot 2s infinite 1s;
}

.dot:nth-child(4) {
  animation: fadeDot 2s infinite 1.5s;
}

@keyframes fadeDot {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.pending-text {
  position: relative;
  display: inline-block;
}

.pending-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: scanLine 1.5s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes scanLine {
  0% {
    background-position: 100% 0;
  }
  50% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.board-gradient {
  background: linear-gradient(
    135deg,
    #0f1729,
    #141e33,
    #1a2540,
    #141e33,
    #0f1729
  );
  background-size: 400% 400%;
  animation: boardGradient 15s ease infinite;
}

@keyframes boardGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Add transition for border color */
.border-2 {
  transition: border-color 0.2s ease-in-out;
}
</style> 