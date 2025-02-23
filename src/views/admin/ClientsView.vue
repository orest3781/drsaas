<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-surface-darker rounded-xl p-6 mb-8 shadow-lg border border-white/10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Client Management</h2>
          <p class="text-white/60 text-sm">Manage your clients and their associated projects</p>
        </div>
        <button
          @click="showNewClientModal = true"
          :disabled="!authStore.hasPermission('canCreateClient')"
          :class="[
            'group bg-gradient-to-r px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3',
            authStore.hasPermission('canCreateClient')
              ? 'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
              : 'from-gray-600 to-gray-700 cursor-not-allowed'
          ]"
        >
          <PlusIcon class="h-5 w-5" />
          New Client
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-surface-darker rounded-xl p-6 mb-8 shadow-lg border border-white/10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-white/60 mb-2">Search Clients</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-10 pr-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Search by name, ID, or contact..."
            />
            <MagnifyingGlassIcon class="h-5 w-5 text-white/40 absolute left-3 top-2.5" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-white/60 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-white/60 mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="name">Name</option>
            <option value="id">Client ID</option>
            <option value="date">Date Added</option>
            <option value="projects">Project Count</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Client List -->
    <div class="bg-surface-darker rounded-xl overflow-hidden shadow-lg border border-white/10">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-surface-dark">
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Client ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Projects</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Date Added</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-surface-dark/50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-mono text-white">{{ client.id }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-primary font-medium">{{ client.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-white">{{ client.name }}</div>
                    <div class="text-sm text-white/60">{{ client.address }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  client.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                ]">
                  {{ client.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">{{ client.projects.length }} Projects</div>
                <div class="text-xs text-white/60">{{ client.projects.filter(p => p.status === 'active').length }} Active</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">{{ client.contact.name }}</div>
                <div class="text-xs text-white/60">{{ client.contact.email }}</div>
                <div class="text-xs text-white/60">{{ client.contact.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">{{ formatDate(client.dateAdded) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                <div class="flex items-center space-x-3">
                  <button
                    @click="editClient(client)"
                    :disabled="!authStore.hasPermission('canEditClient')"
                    :class="[
                      'text-white/60',
                      authStore.hasPermission('canEditClient') ? enabledButtonClass : disabledButtonClass
                    ]"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="viewProjects(client)"
                    :disabled="!authStore.hasPermission('canViewProjects')"
                    :class="[
                      'text-white/60',
                      authStore.hasPermission('canViewProjects') ? enabledButtonClass : disabledButtonClass
                    ]"
                  >
                    <FolderIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="toggleClientStatus(client)"
                    :disabled="!authStore.hasPermission('canToggleClientStatus')"
                    :class="[
                      'text-white/60',
                      authStore.hasPermission('canToggleClientStatus') ? enabledButtonClass : disabledButtonClass
                    ]"
                  >
                    <PowerIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New/Edit Client Modal -->
    <Modal v-if="showNewClientModal" @close="showNewClientModal = false">
      <template #title>
        {{ editingClient ? 'Edit Client' : 'New Client' }}
      </template>
      <template #content>
        <form @submit.prevent="handleClientSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Client Name</label>
            <input
              v-model="clientForm.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Address</label>
            <textarea
              v-model="clientForm.address"
              rows="2"
              required
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/60 mb-2">Contact Name</label>
              <input
                v-model="clientForm.contact.name"
                type="text"
                required
                class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white/60 mb-2">Contact Email</label>
              <input
                v-model="clientForm.contact.email"
                type="email"
                required
                class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white/60 mb-2">Contact Phone</label>
              <input
                v-model="clientForm.contact.phone"
                type="tel"
                required
                class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Notes</label>
            <textarea
              v-model="clientForm.notes"
              rows="3"
              class="w-full px-4 py-2 bg-surface-dark rounded-lg border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showNewClientModal = false"
            class="px-4 py-2 bg-surface-dark hover:bg-surface-dark/80 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleClientSubmit"
            :disabled="editingClient ? !authStore.hasPermission('canEditClient') : !authStore.hasPermission('canCreateClient')"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              editingClient
                ? (authStore.hasPermission('canEditClient') ? 'bg-primary hover:bg-primary/90' : 'bg-gray-600 cursor-not-allowed')
                : (authStore.hasPermission('canCreateClient') ? 'bg-primary hover:bg-primary/90' : 'bg-gray-600 cursor-not-allowed')
            ]"
          >
            {{ editingClient ? 'Update Client' : 'Create Client' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  FolderIcon,
  PowerIcon
} from '@heroicons/vue/24/outline'
import Modal from '../../components/Modal.vue'
import { useAuthStore } from '../../stores/auth'

interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed';
  dateCompleted?: string;
}

interface Client {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive';
  contact: Contact;
  dateAdded: string;
  notes?: string;
  projects: Project[];
}

// State
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('name')
const showNewClientModal = ref(false)
const editingClient = ref<Client | null>(null)

const clientForm = ref({
  name: '',
  address: '',
  contact: {
    name: '',
    email: '',
    phone: ''
  },
  notes: ''
})

// Get auth store
const authStore = useAuthStore()

// Mock data
const clients = ref<Client[]>([
  {
    id: '0001',
    name: 'Acme Corporation',
    address: '123 Business Ave, Suite 100, Business City, BC 12345',
    status: 'active',
    contact: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '(555) 123-4567'
    },
    dateAdded: '2024-01-15T08:00:00Z',
    notes: 'Major healthcare provider with multiple locations',
    projects: [
      { id: '001', name: 'Medical Records 2023', status: 'active' },
      { id: '002', name: 'HR Documents', status: 'completed', dateCompleted: '2024-02-01T00:00:00Z' }
    ]
  },
  {
    id: '0002',
    name: 'TechStart Solutions',
    address: '456 Innovation Park, Tech City, TC 67890',
    status: 'active',
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah.j@techstart.com',
      phone: '(555) 987-6543'
    },
    dateAdded: '2024-02-01T10:30:00Z',
    notes: 'Fast-growing tech company with urgent processing needs',
    projects: [
      { id: '001', name: 'Legal Documentation', status: 'active' }
    ]
  }
])

// Add disabled button base classes
const disabledButtonClass = 'opacity-50 cursor-not-allowed'
const enabledButtonClass = 'hover:text-white transition-colors'

// Computed
const filteredClients = computed(() => {
  let filtered = [...clients.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(client => 
      client.name.toLowerCase().includes(query) ||
      client.id.includes(query) ||
      client.contact.name.toLowerCase().includes(query) ||
      client.contact.email.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(client => client.status === statusFilter.value)
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'id':
        return a.id.localeCompare(b.id)
      case 'date':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case 'projects':
        return b.projects.length - a.projects.length
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editClient = (client: Client) => {
  if (!authStore.hasPermission('canEditClient')) return
  editingClient.value = client
  clientForm.value = {
    name: client.name,
    address: client.address,
    contact: { ...client.contact },
    notes: client.notes || ''
  }
  showNewClientModal.value = true
}

const viewProjects = (client: Client) => {
  if (!authStore.hasPermission('canViewProjects')) return
  // Navigate to projects view filtered for this client
  console.log('View projects for client:', client.id)
}

const toggleClientStatus = (client: Client) => {
  if (!authStore.hasPermission('canToggleClientStatus')) return
  client.status = client.status === 'active' ? 'inactive' : 'active'
}

const handleClientSubmit = () => {
  if (editingClient.value) {
    // Update existing client
    const client = clients.value.find(c => c.id === editingClient.value?.id)
    if (client) {
      Object.assign(client, {
        name: clientForm.value.name,
        address: clientForm.value.address,
        contact: clientForm.value.contact,
        notes: clientForm.value.notes
      })
    }
  } else {
    // Create new client
    const newId = String(clients.value.length + 1).padStart(4, '0')
    clients.value.push({
      id: newId,
      name: clientForm.value.name,
      address: clientForm.value.address,
      status: 'active',
      contact: clientForm.value.contact,
      dateAdded: new Date().toISOString(),
      notes: clientForm.value.notes,
      projects: []
    })
  }

  showNewClientModal.value = false
  resetForm()
}

const resetForm = () => {
  editingClient.value = null
  clientForm.value = {
    name: '',
    address: '',
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    notes: ''
  }
}
</script> 