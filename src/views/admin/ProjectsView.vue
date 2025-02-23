<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-white">Project Management</h2>
        <p class="text-white/60">Manage and monitor all client projects</p>
      </div>
      <button
        @click="showAddProjectModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Project
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search projects..."
          class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white placeholder-white/40"
        />
        <svg
          class="absolute right-3 top-2.5 w-5 h-5 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <select
        v-model="clientFilter"
        class="px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
      >
        <option value="">All Clients</option>
        <option v-for="client in clients" :key="client.id" :value="client.id">
          {{ client.name }}
        </option>
      </select>
      <select
        v-model="statusFilter"
        class="px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="on-hold">On Hold</option>
      </select>
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-surface-darker hover:bg-surface-dark text-white/60 hover:text-white rounded-lg transition-colors border border-white/10"
      >
        Reset Filters
      </button>
    </div>

    <!-- Projects Table -->
    <div class="bg-surface-darker rounded-lg border border-white/10 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/10">
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Project</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">SLA</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Deadline</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-white/5">
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 h-10 w-10 rounded-lg bg-surface-dark flex items-center justify-center">
                  <svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-white">{{ project.name }}</div>
                  <div class="text-sm text-white/60">{{ project.projectId }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-white/60">
              {{ project.clientName }}
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-white/60">{{ project.sla }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-white/60">{{ project.deadline }}</span>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  {
                    'bg-success/20 text-success': project.status === 'active',
                    'bg-error/20 text-error': project.status === 'on-hold',
                    'bg-info/20 text-info': project.status === 'completed'
                  }
                ]"
              >
                {{ project.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <button
                  @click="editProject(project)"
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
                  @click="toggleProjectStatus(project)"
                  class="text-white/60 hover:text-white transition-colors"
                  :title="project.status === 'active' ? 'Complete Project' : 'Reactivate Project'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Project Modal -->
    <div
      v-if="showAddProjectModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-surface-dark rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-white mb-4">
          {{ editingProject ? 'Edit Project' : 'Add New Project' }}
        </h3>
        <form @submit.prevent="saveProject" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Client</label>
            <select
              v-model="projectForm.clientId"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            >
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Project Name</label>
            <input
              v-model="projectForm.name"
              type="text"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">SLA</label>
            <select
              v-model="projectForm.sla"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            >
              <option value="24h">24 Hours</option>
              <option value="48h">48 Hours</option>
              <option value="72h">72 Hours</option>
              <option value="1w">1 Week</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Deadline</label>
            <input
              v-model="projectForm.deadline"
              type="date"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Notes</label>
            <textarea
              v-model="projectForm.notes"
              rows="2"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddProjectModal = false"
              class="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              {{ editingProject ? 'Save Changes' : 'Add Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Client {
  id: string
  name: string
}

interface Project {
  id: string
  projectId: string
  clientId: string
  clientName: string
  name: string
  sla: string
  deadline: string
  status: 'active' | 'completed' | 'on-hold'
  notes: string
}

// State
const searchQuery = ref('')
const clientFilter = ref('')
const statusFilter = ref('')
const showAddProjectModal = ref(false)
const editingProject = ref<Project | null>(null)
const projectForm = ref({
  clientId: '',
  name: '',
  sla: '24h',
  deadline: '',
  notes: ''
})

// Mock data
const clients = ref<Client[]>([
  { id: 'C0001', name: 'MedFirst Healthcare' },
  { id: 'C0002', name: 'Wellness Partners Group' },
  { id: 'C0003', name: 'Vitality Medical Center' }
])

const projects = ref<Project[]>([
  {
    id: '1',
    projectId: 'C0001P001',
    clientId: 'C0001',
    clientName: 'MedFirst Healthcare',
    name: 'Patient Records 2023',
    sla: '24h',
    deadline: '2024-03-20',
    status: 'active',
    notes: 'High priority project with urgent shipments'
  },
  {
    id: '2',
    projectId: 'C0002P001',
    clientId: 'C0002',
    clientName: 'Wellness Partners Group',
    name: 'Insurance Claims Q1',
    sla: '48h',
    deadline: '2024-03-25',
    status: 'active',
    notes: 'Regular processing required'
  },
  {
    id: '3',
    projectId: 'C0003P001',
    clientId: 'C0003',
    clientName: 'Vitality Medical Center',
    name: 'Emergency Records',
    sla: '24h',
    deadline: '2024-03-19',
    status: 'completed',
    notes: 'Completed ahead of schedule'
  }
])

// Computed
const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.projectId.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesClient = !clientFilter.value || project.clientId === clientFilter.value
    const matchesStatus = !statusFilter.value || project.status === statusFilter.value
    return matchesSearch && matchesClient && matchesStatus
  })
})

// Methods
const resetFilters = () => {
  searchQuery.value = ''
  clientFilter.value = ''
  statusFilter.value = ''
}

const editProject = (project: Project) => {
  editingProject.value = project
  projectForm.value = {
    clientId: project.clientId,
    name: project.name,
    sla: project.sla,
    deadline: project.deadline,
    notes: project.notes
  }
  showAddProjectModal.value = true
}

const toggleProjectStatus = (project: Project) => {
  if (project.status === 'active') {
    project.status = 'completed'
  } else if (project.status === 'completed') {
    project.status = 'active'
  }
}

const saveProject = () => {
  if (editingProject.value) {
    // Update existing project
    const project = projects.value.find(p => p.id === editingProject.value?.id)
    if (project) {
      const client = clients.value.find(c => c.id === projectForm.value.clientId)
      project.clientId = projectForm.value.clientId
      project.clientName = client?.name || ''
      project.name = projectForm.value.name
      project.sla = projectForm.value.sla
      project.deadline = projectForm.value.deadline
      project.notes = projectForm.value.notes
    }
  } else {
    // Add new project
    const client = clients.value.find(c => c.id === projectForm.value.clientId)
    if (client) {
      const newId = String(projects.value.length + 1)
      const projectNumber = (projects.value
        .filter(p => p.clientId === client.id)
        .length + 1)
        .toString()
        .padStart(3, '0')
      projects.value.push({
        id: newId,
        projectId: `${client.id}P${projectNumber}`,
        clientId: client.id,
        clientName: client.name,
        name: projectForm.value.name,
        sla: projectForm.value.sla,
        deadline: projectForm.value.deadline,
        status: 'active',
        notes: projectForm.value.notes
      })
    }
  }
  showAddProjectModal.value = false
  editingProject.value = null
  projectForm.value = {
    clientId: '',
    name: '',
    sla: '24h',
    deadline: '',
    notes: ''
  }
}
</script> 