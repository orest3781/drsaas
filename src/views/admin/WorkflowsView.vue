<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-white">Workflow Rules</h2>
        <p class="text-white/60">Configure automation rules and workflow processes</p>
      </div>
      <button
        @click="showAddRuleModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Rule
      </button>
    </div>

    <!-- Rules List -->
    <div class="space-y-4">
      <div v-for="rule in rules" :key="rule.id" 
           class="bg-surface-darker rounded-lg border border-white/10 p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <h3 class="text-lg font-medium text-white">{{ rule.name }}</h3>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                rule.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
              ]">
                {{ rule.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <p class="mt-1 text-sm text-white/60">{{ rule.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="toggleRule(rule)"
              class="text-white/60 hover:text-white transition-colors"
              :title="rule.active ? 'Deactivate' : 'Activate'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </button>
            <button
              @click="editRule(rule)"
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
              @click="deleteRule(rule.id)"
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

        <div class="mt-4 space-y-4">
          <div class="bg-surface-dark rounded-lg p-4">
            <h4 class="text-sm font-medium text-white/80 mb-2">Conditions</h4>
            <div class="space-y-2">
              <div v-for="(condition, index) in rule.conditions" :key="index"
                   class="flex items-center text-sm text-white/60">
                <span class="w-1/3">{{ condition.field }}</span>
                <span class="w-1/3">{{ condition.operator }}</span>
                <span class="w-1/3">{{ condition.value }}</span>
              </div>
            </div>
          </div>

          <div class="bg-surface-dark rounded-lg p-4">
            <h4 class="text-sm font-medium text-white/80 mb-2">Actions</h4>
            <div class="space-y-2">
              <div v-for="(action, index) in rule.actions" :key="index"
                   class="text-sm text-white/60">
                {{ action }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Rule Modal -->
    <div
      v-if="showAddRuleModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-surface-dark rounded-lg p-6 w-full max-w-xl">
        <h3 class="text-lg font-medium text-white mb-4">
          {{ editingRule ? 'Edit Rule' : 'Add New Rule' }}
        </h3>
        <form @submit.prevent="saveRule" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Rule Name</label>
            <input
              v-model="ruleForm.name"
              type="text"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/60 mb-1">Description</label>
            <textarea
              v-model="ruleForm.description"
              rows="2"
              class="w-full px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
              required
            ></textarea>
          </div>

          <!-- Conditions Builder -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Conditions</label>
            <div class="space-y-2">
              <div v-for="(condition, index) in ruleForm.conditions" :key="index"
                   class="flex items-center gap-2">
                <select
                  v-model="condition.field"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                >
                  <option value="client">Client</option>
                  <option value="project">Project</option>
                  <option value="boxType">Box Type</option>
                  <option value="priority">Priority</option>
                </select>
                <select
                  v-model="condition.operator"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="startsWith">Starts With</option>
                  <option value="endsWith">Ends With</option>
                </select>
                <input
                  v-model="condition.value"
                  type="text"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                  placeholder="Value"
                />
                <button
                  type="button"
                  @click="removeCondition(index)"
                  class="text-white/60 hover:text-error transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addCondition"
              class="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Add Condition
            </button>
          </div>

          <!-- Actions Builder -->
          <div>
            <label class="block text-sm font-medium text-white/60 mb-2">Actions</label>
            <div class="space-y-2">
              <div v-for="(action, index) in ruleForm.actions" :key="index"
                   class="flex items-center gap-2">
                <select
                  v-model="action.type"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                >
                  <option value="setPriority">Set Priority</option>
                  <option value="assignTo">Assign To</option>
                  <option value="setSLA">Set SLA</option>
                  <option value="notify">Send Notification</option>
                </select>
                <input
                  v-model="action.value"
                  type="text"
                  class="flex-1 px-4 py-2 bg-surface-darker border border-white/10 rounded-lg text-white"
                  placeholder="Value"
                />
                <button
                  type="button"
                  @click="removeAction(index)"
                  class="text-white/60 hover:text-error transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addAction"
              class="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Add Action
            </button>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddRuleModal = false"
              class="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              {{ editingRule ? 'Save Changes' : 'Add Rule' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Condition {
  field: string
  operator: string
  value: string
}

interface Action {
  type: string
  value: string
}

interface Rule {
  id: string
  name: string
  description: string
  active: boolean
  conditions: Condition[]
  actions: string[]
}

// State
const showAddRuleModal = ref(false)
const editingRule = ref<Rule | null>(null)
const ruleForm = ref({
  name: '',
  description: '',
  conditions: [] as { field: string; operator: string; value: string }[],
  actions: [] as { type: string; value: string }[]
})

// Mock data
const rules = ref<Rule[]>([
  {
    id: '1',
    name: 'Urgent Medical Records',
    description: 'Automatically mark medical records as urgent based on specific criteria',
    active: true,
    conditions: [
      { field: 'boxType', operator: 'equals', value: 'Medical Records' },
      { field: 'client', operator: 'contains', value: 'Hospital' }
    ],
    actions: [
      'Set Priority to Urgent',
      'Send notification to supervisor',
      'Update SLA to 24h'
    ]
  },
  {
    id: '2',
    name: 'Standard Insurance Claims',
    description: 'Process insurance claims with standard workflow',
    active: true,
    conditions: [
      { field: 'project', operator: 'contains', value: 'Insurance' }
    ],
    actions: [
      'Assign to Insurance team',
      'Set SLA to 48h'
    ]
  }
])

// Methods
const toggleRule = (rule: Rule) => {
  rule.active = !rule.active
}

const editRule = (rule: Rule) => {
  editingRule.value = rule
  ruleForm.value = {
    name: rule.name,
    description: rule.description,
    conditions: rule.conditions.map(c => ({ ...c })),
    actions: rule.actions.map(a => ({ type: 'action', value: a }))
  }
  showAddRuleModal.value = true
}

const deleteRule = (id: string) => {
  if (confirm('Are you sure you want to delete this rule?')) {
    const index = rules.value.findIndex(r => r.id === id)
    if (index !== -1) {
      rules.value.splice(index, 1)
    }
  }
}

const addCondition = () => {
  ruleForm.value.conditions.push({
    field: 'client',
    operator: 'equals',
    value: ''
  })
}

const removeCondition = (index: number) => {
  ruleForm.value.conditions.splice(index, 1)
}

const addAction = () => {
  ruleForm.value.actions.push({
    type: 'setPriority',
    value: ''
  })
}

const removeAction = (index: number) => {
  ruleForm.value.actions.splice(index, 1)
}

const saveRule = () => {
  const formattedActions = ruleForm.value.actions.map(a => `${a.type}: ${a.value}`)

  if (editingRule.value) {
    // Update existing rule
    const rule = rules.value.find(r => r.id === editingRule.value?.id)
    if (rule) {
      rule.name = ruleForm.value.name
      rule.description = ruleForm.value.description
      rule.conditions = ruleForm.value.conditions
      rule.actions = formattedActions
    }
  } else {
    // Add new rule
    const newId = String(rules.value.length + 1)
    rules.value.push({
      id: newId,
      name: ruleForm.value.name,
      description: ruleForm.value.description,
      active: true,
      conditions: ruleForm.value.conditions,
      actions: formattedActions
    })
  }
  showAddRuleModal.value = false
  editingRule.value = null
  ruleForm.value = {
    name: '',
    description: '',
    conditions: [],
    actions: []
  }
}
</script> 