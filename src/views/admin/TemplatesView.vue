<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-white">Project Templates</h2>
        <p class="text-white/60">Manage reusable project templates</p>
      </div>
      <button
        @click="showAddTemplateModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Template
      </button>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="template in templates" :key="template.id" 
           class="bg-surface-darker rounded-lg border border-white/10 p-6 hover:border-white/20 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-white">{{ template.name }}</h3>
            <p class="mt-1 text-sm text-white/60">{{ template.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="editTemplate(template)"
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
              @click="deleteTemplate(template.id)"
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

        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-white/60">Default SLA</span>
            <span class="text-white">{{ template.defaultSLA }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-white/60">Workflow Steps</span>
            <span class="text-white">{{ template.workflowSteps.length }}</span>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in template.tags"
              :key="tag"
              class="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Template Modal -->
    <div
      v-if="showAddTemplateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-surface-dark rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-white mb-4">
          {{ editingTemplate ? 'Edit Template' : 'Add New Template' }}
        </h3>
        <form @submit.prevent="saveTemplate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Template Name</label>
            <input
              v-model="templateForm.name"
              type="text"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Description</label>
            <textarea
              v-model="templateForm.description"
              rows="3"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Default SLA</label>
            <select
              v-model="templateForm.defaultSLA"
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
            <label class="block text-sm font-medium text-white/60 mb-1">Tags</label>
            <input
              v-model="templateForm.tags"
              type="text"
              placeholder="Comma-separated tags"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
            />
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddTemplateModal = false"
              class="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              {{ editingTemplate ? 'Save Changes' : 'Add Template' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Template {
  id: string
  name: string
  description: string
  defaultSLA: string
  workflowSteps: string[]
  tags: string[]
}

// State
const showAddTemplateModal = ref(false)
const editingTemplate = ref<Template | null>(null)
const templateForm = ref({
  name: '',
  description: '',
  defaultSLA: '24h',
  tags: ''
})

// Mock data
const templates = ref<Template[]>([
  {
    id: '1',
    name: 'Standard Medical Records',
    description: 'Template for processing standard medical record shipments',
    defaultSLA: '48h',
    workflowSteps: ['Prep', 'Scan', 'QC', 'Index'],
    tags: ['Medical', 'Records', 'Standard']
  },
  {
    id: '2',
    name: 'Urgent Care Documents',
    description: 'Expedited processing for urgent care documentation',
    defaultSLA: '24h',
    workflowSteps: ['Prep', 'Priority Scan', 'QC', 'Index'],
    tags: ['Urgent', 'Medical', 'Priority']
  },
  {
    id: '3',
    name: 'Insurance Claims',
    description: 'Template for processing insurance claim documentation',
    defaultSLA: '72h',
    workflowSteps: ['Sort', 'Prep', 'Scan', 'QC', 'Index'],
    tags: ['Insurance', 'Claims', 'Standard']
  }
])

// Methods
const editTemplate = (template: Template) => {
  editingTemplate.value = template
  templateForm.value = {
    name: template.name,
    description: template.description,
    defaultSLA: template.defaultSLA,
    tags: template.tags.join(', ')
  }
  showAddTemplateModal.value = true
}

const deleteTemplate = (id: string) => {
  if (confirm('Are you sure you want to delete this template?')) {
    const index = templates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      templates.value.splice(index, 1)
    }
  }
}

const saveTemplate = () => {
  const formattedTags = templateForm.value.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)

  if (editingTemplate.value) {
    // Update existing template
    const template = templates.value.find(t => t.id === editingTemplate.value?.id)
    if (template) {
      template.name = templateForm.value.name
      template.description = templateForm.value.description
      template.defaultSLA = templateForm.value.defaultSLA
      template.tags = formattedTags
    }
  } else {
    // Add new template
    const newId = String(templates.value.length + 1)
    templates.value.push({
      id: newId,
      name: templateForm.value.name,
      description: templateForm.value.description,
      defaultSLA: templateForm.value.defaultSLA,
      workflowSteps: ['Prep', 'Scan', 'QC', 'Index'],
      tags: formattedTags
    })
  }
  showAddTemplateModal.value = false
  editingTemplate.value = null
  templateForm.value = {
    name: '',
    description: '',
    defaultSLA: '24h',
    tags: ''
  }
}
</script> 