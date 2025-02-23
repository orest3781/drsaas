<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header Card -->
    <div class="bg-surface-darker rounded-xl p-6 mb-8 shadow-lg border border-white/10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Shipment Intake</h2>
          <p class="text-white/60 text-sm">Process and label incoming document boxes</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="printLabels"
            class="px-4 py-2 bg-surface-dark hover:bg-surface-dark/80 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Labels
          </button>
          <button
            @click="startNewShipment"
            class="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Shipment
          </button>
        </div>
      </div>
    </div>

    <!-- Shipment Form -->
    <div v-if="showShipmentForm" class="bg-surface-darker rounded-xl p-6 mb-8 shadow-lg border border-white/10">
      <form @submit.prevent="handleShipmentSubmit" class="space-y-6">
        <!-- Client and Project Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Client</label>
            <select
              v-model="shipmentForm.clientId"
              required
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              @change="loadProjects"
            >
              <option value="">Select Client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }} ({{ client.id }})
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Project</label>
            <select
              v-model="shipmentForm.projectId"
              required
              :disabled="!shipmentForm.clientId"
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
            >
              <option value="">Select Project</option>
              <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                {{ project.name }} ({{ project.id }})
              </option>
            </select>
          </div>
        </div>

        <!-- Box Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-white">Box Details</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/60 mb-2">Box Count</label>
              <input
                v-model="shipmentForm.boxCount"
                type="number"
                min="1"
                required
                class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-white/60 mb-2">Box Type</label>
              <select
                v-model="shipmentForm.boxType"
                required
                class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="standard">Standard</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-white/60 mb-2">Carrier</label>
              <select
                v-model="shipmentForm.carrier"
                required
                class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select Carrier</option>
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
                <option value="usps">USPS</option>
                <option value="dhl">DHL</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Tracking Number</label>
            <input
              v-model="shipmentForm.trackingNumber"
              type="text"
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter tracking number (optional)..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Notes</label>
            <textarea
              v-model="shipmentForm.notes"
              rows="3"
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Any special handling instructions or additional information..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="cancelShipment"
            class="px-4 py-2 bg-surface-dark hover:bg-surface-dark/80 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            Generate Labels
          </button>
        </div>
      </form>
    </div>

    <!-- Recent Shipments -->
    <div class="bg-surface-darker rounded-xl overflow-hidden shadow-lg border border-white/10">
      <div class="p-6 border-b border-white/10">
        <h3 class="text-lg font-medium text-white">Recent Shipments</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-surface-dark">
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Shipment ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Project</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Boxes</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Carrier</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Tracking Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="shipment in recentShipments" :key="shipment.id" class="hover:bg-surface-dark/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{{ shipment.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ shipment.clientName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ shipment.projectName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ shipment.boxCount }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white capitalize">{{ shipment.boxType }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ shipment.carrier }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ shipment.trackingNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                {{ formatDate(shipment.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                <button
                  @click="reprintLabels(shipment)"
                  class="text-primary hover:text-primary/80"
                >
                  Reprint Labels
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string;
  clientId: string;
  name: string;
}

interface Shipment {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  boxCount: number;
  boxType: 'standard' | 'long';
  carrier: string;
  trackingNumber: string;
  notes?: string;
  createdAt: string;
}

// Mock data
const clients = ref<Client[]>([
  { id: '0001', name: 'Acme Corp' },
  { id: '0002', name: 'TechStart Inc' },
  { id: '0003', name: 'Global Industries' }
])

const projects = ref<Project[]>([
  { id: '001', clientId: '0001', name: 'Annual Reports' },
  { id: '002', clientId: '0001', name: 'HR Documents' },
  { id: '003', clientId: '0002', name: 'Legal Records' }
])

const recentShipments = ref<Shipment[]>([
  {
    id: 'C0001P001B00001',
    clientId: '0001',
    clientName: 'Acme Corp',
    projectId: '001',
    projectName: 'Annual Reports',
    boxCount: 5,
    boxType: 'standard',
    carrier: 'FedEx',
    trackingNumber: '1234567890',
    createdAt: new Date().toISOString()
  }
])

// State
const showShipmentForm = ref(false)
const shipmentForm = ref({
  clientId: '',
  projectId: '',
  boxCount: 1,
  boxType: 'standard',
  carrier: '',
  trackingNumber: '',
  notes: ''
})

// Computed
const availableProjects = computed(() => {
  return projects.value.filter(p => p.clientId === shipmentForm.value.clientId)
})

// Methods
const startNewShipment = () => {
  showShipmentForm.value = true
}

const cancelShipment = () => {
  showShipmentForm.value = false
  resetForm()
}

const loadProjects = () => {
  shipmentForm.value.projectId = ''
}

const handleShipmentSubmit = () => {
  const client = clients.value.find(c => c.id === shipmentForm.value.clientId)
  const project = projects.value.find(p => p.id === shipmentForm.value.projectId)
  
  if (!client || !project) return

  // Generate shipment ID based on format: C0000P000B00000
  const lastShipment = recentShipments.value[0]
  const boxNumber = lastShipment ? 
    String(Number(lastShipment.id.slice(-5)) + 1).padStart(5, '0') : 
    '00001'
  
  const shipmentId = `C${client.id}P${project.id}B${boxNumber}`

  const newShipment: Shipment = {
    id: shipmentId,
    clientId: client.id,
    clientName: client.name,
    projectId: project.id,
    projectName: project.name,
    boxCount: shipmentForm.value.boxCount,
    boxType: shipmentForm.value.boxType,
    carrier: shipmentForm.value.carrier,
    trackingNumber: shipmentForm.value.trackingNumber,
    notes: shipmentForm.value.notes,
    createdAt: new Date().toISOString()
  }

  recentShipments.value.unshift(newShipment)
  showShipmentForm.value = false
  resetForm()
}

const resetForm = () => {
  shipmentForm.value = {
    clientId: '',
    projectId: '',
    boxCount: 1,
    boxType: 'standard',
    carrier: '',
    trackingNumber: '',
    notes: ''
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const printLabels = () => {
  // Implement label printing logic
  console.log('Printing labels...')
}

const reprintLabels = (shipment: Shipment) => {
  // Implement label reprinting logic
  console.log('Reprinting labels for shipment:', shipment.id)
}
</script> 