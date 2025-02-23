<!-- KioskView.vue -->
<template>
  <div class="kiosk-view">
    <!-- Background -->
    <KioskBackground />
    
    <!-- Content -->
    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="text-3xl font-bold tracking-wider flex items-center justify-center gap-[1px] relative mb-2">
          <span class="bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">Med</span>
          <span class="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">Atlas</span>
        </div>
        <div class="text-white/50">{{ currentTime }}</div>
      </div>

      <!-- Cards Grid -->
      <div class="grid">
        <!-- Scan Card -->
        <div class="card">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="2" />
            </svg>
          </span>
          <h4>{{ scanStep === 'employee' ? 'Scan Employee Badge' : 'Scan Shipment Barcode' }}</h4>
          
          <!-- Scan Input -->
          <div class="mt-4">
            <input
              ref="scanInput"
              v-model="scanValue"
              type="text"
              :placeholder="scanStep === 'employee' ? 'Scan Employee Badge' : 'Scan Shipment Barcode'"
              class="w-full px-3 py-2 bg-surface-darker border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500 text-sm"
              @keyup.enter="handleScan"
              autocomplete="off"
            />
          </div>
          
          <!-- Preview -->
          <div v-if="scanStep === 'shipment' && employeeId" class="mt-3 p-2 rounded bg-surface-darker/50 border border-white/5">
            <div class="text-xs text-white/60">Employee ID:</div>
            <div class="text-sm text-white font-medium">{{ employeeId }}</div>
          </div>

          <!-- Status Message -->
          <div v-if="statusMessage" :class="['mt-3 p-2 rounded text-xs', statusMessage.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400']">
            {{ statusMessage.text }}
          </div>

          <!-- Cancel Button -->
          <button
            v-if="scanStep === 'shipment'"
            @click="resetScan"
            class="mt-3 w-full px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          <div class="shine"></div>
          <div class="background">
            <div class="tiles">
              <div class="tile tile-1"></div>
              <div class="tile tile-2"></div>
              <div class="tile tile-3"></div>
              <div class="tile tile-4"></div>
              <div class="tile tile-5"></div>
              <div class="tile tile-6"></div>
              <div class="tile tile-7"></div>
              <div class="tile tile-8"></div>
              <div class="tile tile-9"></div>
              <div class="tile tile-10"></div>
            </div>
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
          </div>
        </div>

        <!-- Current Jobs Card -->
        <div class="card">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </span>
          <h4>Active Jobs</h4>
          
          <div class="mt-4 space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar">
            <div v-for="job in currentJobs" :key="job.id" 
              class="p-2 bg-surface-darker/50 rounded border border-white/5 text-sm"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium text-white">Shipment {{ job.shipmentId }}</div>
                  <div class="text-white/60 text-xs">Operator: {{ job.employeeId }}</div>
                  <div class="text-white/40 text-xs">Started: {{ job.startTime }}</div>
                </div>
                <div class="text-right">
                  <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', 
                    job.status === 'In Progress' ? 'bg-sky-500/20 text-sky-400' : 'bg-yellow-500/20 text-yellow-400']"
                  >
                    {{ job.status }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="currentJobs.length === 0" class="text-center text-white/40 py-4 text-sm">
              No active jobs
            </div>
          </div>

          <div class="shine"></div>
          <div class="background">
            <div class="tiles">
              <div class="tile tile-1"></div>
              <div class="tile tile-2"></div>
              <div class="tile tile-3"></div>
              <div class="tile tile-4"></div>
              <div class="tile tile-5"></div>
              <div class="tile tile-6"></div>
              <div class="tile tile-7"></div>
              <div class="tile tile-8"></div>
              <div class="tile tile-9"></div>
              <div class="tile tile-10"></div>
            </div>
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KioskBackground from '../components/KioskBackground.vue'

// Time display
const currentTime = ref(new Date().toLocaleString())
setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

// Scan state
const scanStep = ref<'employee' | 'shipment'>('employee')
const scanValue = ref('')
const employeeId = ref('')
const statusMessage = ref<{ type: 'success' | 'error', text: string } | null>(null)
const scanInput = ref<HTMLInputElement | null>(null)

// Jobs state
const currentJobs = ref([
  {
    id: 1,
    shipmentId: 'SHIP001',
    employeeId: 'EMP123',
    startTime: '9:30 AM',
    status: 'In Progress'
  },
  {
    id: 2,
    shipmentId: 'SHIP002',
    employeeId: 'EMP456',
    startTime: '10:15 AM',
    status: 'In Progress'
  }
])

// Focus input on mount and after each scan
onMounted(() => {
  focusScanInput()
})

const focusScanInput = () => {
  setTimeout(() => {
    scanInput.value?.focus()
  }, 0)
}

const handleScan = () => {
  if (!scanValue.value) {
    statusMessage.value = { 
      type: 'error', 
      text: `Please scan ${scanStep.value === 'employee' ? 'employee badge' : 'shipment barcode'}` 
    }
    return
  }

  if (scanStep.value === 'employee') {
    // Handle employee badge scan
    employeeId.value = scanValue.value
    scanStep.value = 'shipment'
    statusMessage.value = { type: 'success', text: 'Employee verified. Please scan shipment barcode.' }
  } else {
    // Handle shipment barcode scan
    createJob(employeeId.value, scanValue.value)
  }

  // Clear scan value and refocus
  scanValue.value = ''
  focusScanInput()
}

const createJob = (empId: string, shipId: string) => {
  // Create new job
  const newJob = {
    id: Date.now(),
    shipmentId: shipId,
    employeeId: empId,
    startTime: new Date().toLocaleTimeString(),
    status: 'In Progress'
  }

  // Add to jobs list
  currentJobs.value.unshift(newJob)

  // Reset scan state
  statusMessage.value = { type: 'success', text: 'Job created successfully' }
  resetScan()
}

const resetScan = () => {
  scanStep.value = 'employee'
  scanValue.value = ''
  employeeId.value = ''
  statusMessage.value = null
  focusScanInput()
}
</script>

<style scoped>
.kiosk-view {
  @apply min-h-screen bg-[#0f1729] text-white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: 2rem;
}

.card {
  @apply bg-surface-dark/30 backdrop-blur-md rounded-xl p-6 border border-white/5 relative cursor-pointer transition-all duration-300;
}

.card::before {
  content: '';
  @apply absolute inset-0 rounded-xl bg-surface-dark/30;
}

.icon {
  @apply z-[2] relative table p-2;
}

.icon::after {
  content: '';
  @apply absolute inset-[4.5px] rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300;
}

.icon svg {
  @apply relative z-[1] block w-6 h-6 text-white/70 transition-colors duration-300;
}

.card h4 {
  @apply z-[2] relative m-0 mt-3 font-semibold text-base text-white;
}

.shine {
  @apply rounded-xl absolute inset-0 z-[1] overflow-hidden opacity-0 transition-opacity duration-500;
}

.shine:before {
  content: '';
  @apply w-[150%] pb-[150%] rounded-[50%] absolute left-[50%] bottom-[55%] blur-[35px] opacity-10 -translate-x-[50%];
  background-image: conic-gradient(from 205deg at 50% 50%, rgba(16, 185, 129, 0) 0deg, #10B981 25deg, rgba(52, 211, 153, 0.18) 295deg, rgba(16, 185, 129, 0) 360deg);
}

.background {
  @apply rounded-xl absolute inset-0 overflow-hidden;
  -webkit-mask-image: radial-gradient(circle at 60% 5%, black 0%, black 15%, transparent 60%);
  mask-image: radial-gradient(circle at 60% 5%, black 0%, black 15%, transparent 60%);
}

.tiles {
  @apply opacity-0 transition-opacity duration-300;
}

.tile {
  @apply absolute bg-emerald-500/5;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  opacity: 0;
}

@keyframes tile {
  0%, 12.5%, 100% { opacity: 1; }
  25%, 82.5% { opacity: 0; }
}

.card:hover {
  @apply border-white/20 shadow-lg;
}

.card:hover .icon::after {
  @apply bg-emerald-500/10 border-emerald-500/20;
}

.card:hover .icon svg {
  @apply text-emerald-400;
}

.card:hover .shine {
  @apply opacity-100;
}

.card:hover .tiles {
  @apply opacity-100 delay-300;
}

.card:hover .tile {
  animation-name: tile;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
</style> 