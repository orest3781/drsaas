<template>
  <div class="min-h-screen bg-[#0f1729]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 board-gradient">
      <!-- Queue Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-surface-dark rounded-lg p-6 border border-white/10">
          <h3 class="text-lg font-medium text-white/90">Total Boxes</h3>
          <p class="text-3xl font-bold text-white">{{ totalBoxes }}</p>
        </div>
        <div class="bg-surface-dark rounded-lg p-6 border border-white/10">
          <h3 class="text-lg font-medium text-white/90">Urgent Shipments</h3>
          <p class="text-3xl font-bold text-error">{{ urgentCount }}</p>
        </div>
        <div class="bg-surface-dark rounded-lg p-6 border border-white/10">
          <h3 class="text-lg font-medium text-white/90">On Hold</h3>
          <p class="text-3xl font-bold text-yellow-500">{{ onHoldCount }}</p>
          <p class="text-sm text-white/60 mt-1">Across {{ onHoldProjectsCount }} projects</p>
        </div>
        <div class="bg-surface-dark rounded-lg p-6 border border-white/10">
          <h3 class="text-lg font-medium text-white/90">Active Projects</h3>
          <p class="text-3xl font-bold text-primary">{{ activeProjects }}</p>
        </div>
      </div>

      <!-- Client Filter -->
      <div class="mb-6 flex justify-between items-center">
        <div class="relative flex-1">
          <input
            type="text"
            v-model="clientSearch"
            placeholder="Search clients..."
            class="w-full px-4 py-2 bg-surface-dark border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <span class="absolute right-3 top-2.5 text-white/40">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        <div class="flex gap-2 ml-4">
          <button
            @click="toggleAll"
            class="w-32 px-4 py-2 bg-surface-dark hover:bg-surface-darker text-white/60 hover:text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/5"
            :title="isAllExpanded ? 'Collapse All' : 'Expand All'"
          >
            <svg class="h-5 w-5 transition-transform duration-200 shrink-0" 
                 :class="{ 'rotate-180': isAllExpanded }"
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            <span class="whitespace-nowrap">{{ isAllExpanded ? 'Collapse' : 'Expand' }}</span>
          </button>
          <button
            @click="toggleProjects"
            class="w-40 px-4 py-2 bg-surface-dark hover:bg-surface-darker text-white/60 hover:text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/5"
            :title="areProjectsExpanded ? 'Collapse Projects' : 'Expand Projects'"
          >
            <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a4 4 0 01-4 4H4m8-12v8a4 4 0 01-4 4H8" />
            </svg>
            <span class="whitespace-nowrap">{{ areProjectsExpanded ? 'Collapse Projects' : 'Expand Projects' }}</span>
          </button>
        </div>
      </div>

      <!-- Client Cards -->
      <div class="space-y-4">
        <TransitionGroup name="list">
          <div
            v-for="client in filteredClients"
            :key="client.id"
            class="bg-surface-dark rounded-lg overflow-hidden border border-white/10"
          >
            <!-- Client Header -->
            <div
              class="px-6 py-4 flex justify-between items-center cursor-pointer"
              @click="toggleClient(client.id)"
            >
              <div class="flex items-center space-x-4">
                <span class="text-lg font-medium text-white/90">{{ client.name }}</span>
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 rounded-full text-sm"
                    :class="client.hasUrgent ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'"
                  >
                    {{ client.totalBoxes }} Boxes
                  </span>
                  <span v-if="getClientHoldCount(client) > 0" 
                    class="px-2.5 py-0.5 rounded-full text-sm bg-yellow-500/20 text-yellow-500"
                  >
                    {{ getClientHoldCount(client) }} On Hold
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-sm bg-surface-darker text-white/60">
                    {{ client.projects.length }} Projects
                  </span>
                </div>
              </div>
              <svg
                class="h-5 w-5 text-white/40 transform transition-transform duration-200"
                :class="{ 'rotate-180': expandedClients.includes(client.id) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Projects List -->
            <div v-show="expandedClients.includes(client.id)">
              <div
                v-for="project in client.projects"
                :key="project.id"
                class="px-6 py-4 cursor-pointer hover:bg-white/5"
                @click="toggleProject(project.id)"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-4">
                    <div>
                      <h4 class="text-md font-medium text-white/90">{{ project.name }}</h4>
                      <p class="text-sm text-white/60">Project ID: {{ project.id }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="px-2.5 py-0.5 rounded-full text-sm"
                        :class="[
                          project.shipments.some((s: Shipment) => s.isUrgent) && project.shipments.some((s: Shipment) => !s.isUrgent)
                            ? 'bg-surface-darker text-white/60'
                            : project.shipments.some((s: Shipment) => s.isUrgent)
                              ? 'bg-error/20 text-error'
                              : 'bg-primary/20 text-primary'
                        ]"
                      >
                        {{ project.shipments.length }} Boxes
                      </span>
                      <template v-if="project.shipments.some((s: Shipment) => s.isUrgent) && project.shipments.some((s: Shipment) => !s.isUrgent)">
                        <span class="px-2.5 py-0.5 rounded-full text-sm bg-error/20 text-error">
                          {{ project.shipments.filter((s: Shipment) => s.isUrgent).length }} Urgent
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full text-sm bg-primary/20 text-primary">
                          {{ project.shipments.filter((s: Shipment) => !s.isUrgent).length }} Regular
                        </span>
                      </template>
                      <span v-if="getProjectHoldCount(project) > 0" 
                        class="px-2.5 py-0.5 rounded-full text-sm bg-yellow-500/20 text-yellow-500"
                      >
                        {{ getProjectHoldCount(project) }} On Hold
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span class="text-sm text-white/60">SLA: {{ project.sla }}</span>
                    <span class="text-sm text-white/60">Deadline: {{ project.deadline }}</span>
                    <svg
                      class="h-4 w-4 text-white/40 transform transition-transform duration-200"
                      :class="{ 'rotate-180': expandedProjects.includes(project.id) }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- Shipment Items -->
                <div v-show="expandedProjects.includes(project.id)" class="mt-4 space-y-2">
                  <div
                    v-for="shipment in project.shipments"
                    :key="shipment.id"
                    class="flex items-center justify-between p-3 bg-surface-darker rounded-lg relative group"
                    :class="[
                      shipment.isUrgent ? 'border-l-4 border-error' : 'border-l-4 border-primary',
                      shipment.status === 'hold' ? 'border-l-4 border-yellow-500' : ''
                    ]"
                  >
                    <div class="flex items-center space-x-4">
                      <span class="text-sm font-medium text-white/90">{{ shipment.id }}</span>
                      <span class="text-sm text-white/60">{{ shipment.boxType }}</span>
                      <span class="text-sm text-white/60">Received: {{ shipment.receivedAt }}</span>
                      
                      <!-- Hold Message -->
                      <div v-if="shipment.status === 'hold'" 
                        class="ml-2 px-2 py-1 bg-yellow-500/10 rounded text-yellow-500 text-xs flex items-center gap-2"
                      >
                        <span>On Hold</span>
                        <span class="text-white/60">{{ shipment.holdInfo?.reason }}</span>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <HoldButton
                        :is-on-hold="shipment.status === 'hold'"
                        :current-status="shipment.currentStep || 'Pending'"
                        @hold="(holdInfo) => handleShipmentHold(shipment, holdInfo)"
                        @resume="() => handleShipmentResume(shipment)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <div class="fixed bottom-8 right-8 flex flex-col gap-4">
      <button 
        @click="toggleAll"
        class="p-3 bg-surface-dark hover:bg-surface-darker text-white/40 hover:text-white/80 rounded-full shadow-lg transition-all hover:scale-102 group border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface-dark disabled:hover:scale-100"
        :title="isAllExpanded ? 'Collapse All' : 'Expand All'"
      >
        <svg class="w-5 h-5 transition-transform duration-200" 
             :class="{ 'rotate-180': isAllExpanded }"
             fill="none" 
             stroke="currentColor" 
             viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import HoldButton from '../components/HoldButton.vue'

// Mock data structure
interface Shipment {
  id: string
  boxType: string
  receivedAt: string
  isUrgent: boolean
  status?: 'in_progress' | 'hold'
  currentStep?: string
  holdInfo?: {
    reason: string
    reasonType: string
    expectedResolution: string
    contactInfo: string
    timestamp: string
    previousStatus: string
  }
}

interface Project {
  id: string
  name: string
  sla: string
  deadline: string
  shipments: Shipment[]
}

interface Client {
  id: string
  name: string
  hasUrgent: boolean
  totalBoxes: number
  projects: Project[]
}

// State
const clientSearch = ref('')
const expandedClients = ref<string[]>([])
const expandedProjects = ref<string[]>([])
const areProjectsExpanded = ref(false)
const isAllExpanded = ref(false)

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

// Computed
const filteredClients = computed(() => {
  return clients.value.filter(client =>
    client.name.toLowerCase().includes(clientSearch.value.toLowerCase())
  )
})

const totalBoxes = computed(() => {
  return clients.value.reduce((sum, client) => sum + client.totalBoxes, 0)
})

const urgentCount = computed(() => {
  return clients.value.reduce((count, client) => {
    return count + client.projects.reduce((projectCount, project) => {
      return projectCount + project.shipments.filter(s => s.isUrgent).length
    }, 0)
  }, 0)
})

const activeProjects = computed(() => {
  return clients.value.reduce((count, client) => {
    return count + client.projects.length
  }, 0)
})

const onHoldCount = computed(() => {
  return clients.value.reduce((count, client) => {
    return count + client.projects.reduce((projectCount, project) => {
      return projectCount + project.shipments.filter(s => s.status === 'hold').length
    }, 0)
  }, 0)
})

const onHoldProjectsCount = computed(() => {
  return clients.value.reduce((count, client) => {
    return count + client.projects.filter(project => 
      project.shipments.some(s => s.status === 'hold')
    ).length
  }, 0)
})

// Methods
const toggleClient = (clientId: string) => {
  const index = expandedClients.value.indexOf(clientId)
  if (index === -1) {
    expandedClients.value.push(clientId)
  } else {
    expandedClients.value.splice(index, 1)
    // Also collapse all projects for this client
    const clientProjects = filteredClients.value
      .find(c => c.id === clientId)
      ?.projects.map(p => p.id) || []
    expandedProjects.value = expandedProjects.value.filter(
      id => !clientProjects.includes(id)
    )
  }
}

const toggleProject = (projectId: string) => {
  const index = expandedProjects.value.indexOf(projectId)
  if (index === -1) {
    expandedProjects.value.push(projectId)
  } else {
    expandedProjects.value.splice(index, 1)
  }
}

const toggleProjects = () => {
  const allClientIds = filteredClients.value.map(client => client.id)
  
  if (!areProjectsExpanded.value) {
    // Expand all clients but keep boxes collapsed
    expandedClients.value = allClientIds
    expandedProjects.value = [] // Keep boxes collapsed
    isAllExpanded.value = false // Reset the all expanded state when expanding projects
  } else {
    // Collapse all clients
    expandedClients.value = []
    expandedProjects.value = []
  }
  
  areProjectsExpanded.value = !areProjectsExpanded.value
}

const toggleAll = () => {
  if (!isAllExpanded.value) {
    // Expand everything
    const allClientIds = filteredClients.value.map(client => client.id)
    const allProjectIds = filteredClients.value.flatMap(client => 
      client.projects.map(project => project.id)
    )
    expandedClients.value = allClientIds
    expandedProjects.value = allProjectIds
    areProjectsExpanded.value = false // Reset the projects expanded state when expanding all
  } else {
    // Collapse everything
    expandedClients.value = []
    expandedProjects.value = []
  }
  isAllExpanded.value = !isAllExpanded.value
}

const handleShipmentHold = (shipment, holdInfo) => {
  shipment.status = 'hold'
  shipment.holdInfo = {
    ...holdInfo,
    previousStatus: shipment.status
  }
}

const handleShipmentResume = (shipment) => {
  shipment.status = shipment.holdInfo?.previousStatus || 'in_progress'
  shipment.holdInfo = undefined
}

const getClientHoldCount = (client: Client) => {
  return client.projects.reduce((count, project) => {
    return count + project.shipments.filter(s => s.status === 'hold').length
  }, 0)
}

const getProjectHoldCount = (project: Project) => {
  return project.shipments.filter(s => s.status === 'hold').length
}

// Add event listeners
onMounted(() => {
  window.addEventListener('expand-all', toggleAll)
})

onUnmounted(() => {
  window.removeEventListener('expand-all', toggleAll)
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
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

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.animate-pulse-border {
  animation: pulse-border 2s infinite;
  position: relative;
}

.animate-pulse-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.6));
  animation: pulse-border 2s infinite;
  z-index: -1;
}

/* Floating button animations */
@keyframes float-button {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.float-button {
  animation: float-button 3s ease-in-out infinite;
}
</style> 