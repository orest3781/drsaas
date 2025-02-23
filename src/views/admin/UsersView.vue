<template>
  <div class="space-y-6">
    <!-- Users List -->
    <DataTable
      :columns="columns"
      :data="users"
      :filters="filters"
      :loading="loading"
      search-placeholder="Search users..."
      @update:sort="handleSort"
      @export="exportUsers"
    >
      <!-- Status Column -->
      <template #status="{ value }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="{
            'bg-success/10 text-success': value === 'active',
            'bg-warning/10 text-warning': value === 'pending',
            'bg-error/10 text-error': value === 'inactive'
          }"
        >
          {{ value.charAt(0).toUpperCase() + value.slice(1) }}
        </span>
      </template>

      <!-- Role Column -->
      <template #role="{ value }">
        <span
          class="inline-flex items-center space-x-1"
          :class="{
            'text-primary': value === 'admin',
            'text-warning': value === 'supervisor',
            'text-success': value === 'operator'
          }"
        >
          <ShieldCheckIcon v-if="value === 'admin'" class="h-4 w-4" />
          <UserGroupIcon v-else-if="value === 'supervisor'" class="h-4 w-4" />
          <UserIcon v-else class="h-4 w-4" />
          <span>{{ value.charAt(0).toUpperCase() + value.slice(1) }}</span>
        </span>
      </template>

      <!-- Last Active Column -->
      <template #lastActive="{ value }">
        <span class="text-white/60">{{ formatDate(value) }}</span>
      </template>

      <!-- Actions Column -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end space-x-2">
          <button
            @click="editUser(item)"
            class="p-1 text-white/60 hover:text-white transition-colors"
          >
            <PencilIcon class="h-4 w-4" />
          </button>
          <button
            @click="deleteUser(item)"
            class="p-1 text-white/60 hover:text-error transition-colors"
          >
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Add/Edit User Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md">
                <FormSection
                  :title="editingUser ? 'Edit User' : 'Add User'"
                  :loading="saving"
                  @submit="saveUser"
                  @cancel="closeModal"
                >
                  <div class="space-y-4">
                    <FormInput
                      v-model="userForm.name"
                      label="Name"
                      required
                      :error="errors.name"
                    />

                    <FormInput
                      v-model="userForm.email"
                      type="email"
                      label="Email"
                      required
                      :error="errors.email"
                    />

                    <FormInput
                      v-model="userForm.role"
                      type="select"
                      label="Role"
                      required
                      :options="roleOptions"
                      :error="errors.role"
                    />

                    <FormInput
                      v-if="!editingUser"
                      v-model="userForm.password"
                      type="password"
                      label="Password"
                      required
                      :error="errors.password"
                    />

                    <FormInput
                      v-model="userForm.status"
                      type="select"
                      label="Status"
                      required
                      :options="statusOptions"
                      :error="errors.status"
                    />
                  </div>
                </FormSection>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="showDeleteConfirm" as="template">
      <Dialog as="div" @close="showDeleteConfirm = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md bg-surface-dark rounded-lg p-6 border border-white/10">
                <DialogTitle class="text-lg font-medium text-white mb-4">
                  Delete User
                </DialogTitle>

                <p class="text-sm text-white/60">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    @click="showDeleteConfirm = false"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-error hover:bg-error/90 rounded-lg transition-colors"
                    :disabled="deleting"
                    @click="confirmDelete"
                  >
                    <span :class="{ 'opacity-0': deleting }">Delete</span>
                    <div
                      v-if="deleting"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import DataTable from '@/components/admin/DataTable.vue'
import FormSection from '@/components/admin/FormSection.vue'
import FormInput from '@/components/admin/FormInput.vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastActive: string
}

// Table configuration
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastActive', label: 'Last Active', sortable: true }
]

const filters = [
  { key: 'role', label: 'Admin' },
  { key: 'role', label: 'Supervisor' },
  { key: 'role', label: 'Operator' },
  { key: 'status', label: 'Active' },
  { key: 'status', label: 'Pending' },
  { key: 'status', label: 'Inactive' }
]

// Mock data
const users = ref<User[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '2024-03-15T10:30:00'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'supervisor',
    status: 'active',
    lastActive: '2024-03-15T09:15:00'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'operator',
    status: 'inactive',
    lastActive: '2024-03-14T16:45:00'
  }
])

// Form state
const isModalOpen = ref(false)
const editingUser = ref<User | null>(null)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showDeleteConfirm = ref(false)
const userToDelete = ref<User | null>(null)

const userForm = reactive({
  name: '',
  email: '',
  role: '',
  password: '',
  status: 'active'
})

const errors = reactive({
  name: '',
  email: '',
  role: '',
  password: '',
  status: ''
})

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Operator', value: 'operator' }
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' }
]

// Methods
const handleSort = ({ key, order }: { key: string; order: 'asc' | 'desc' }) => {
  users.value.sort((a, b) => {
    if (a[key as keyof User] < b[key as keyof User]) return order === 'asc' ? -1 : 1
    if (a[key as keyof User] > b[key as keyof User]) return order === 'asc' ? 1 : -1
    return 0
  })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const resetForm = () => {
  userForm.name = ''
  userForm.email = ''
  userForm.role = ''
  userForm.password = ''
  userForm.status = 'active'
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const editUser = (user: User) => {
  editingUser.value = user
  userForm.name = user.name
  userForm.email = user.email
  userForm.role = user.role
  userForm.status = user.status
  isModalOpen.value = true
}

const deleteUser = (user: User) => {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingUser.value = null
  resetForm()
}

const validateForm = () => {
  let isValid = true
  
  if (!userForm.name) {
    errors.name = 'Name is required'
    isValid = false
  }
  
  if (!userForm.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }
  
  if (!userForm.role) {
    errors.role = 'Role is required'
    isValid = false
  }
  
  if (!editingUser.value && !userForm.password) {
    errors.password = 'Password is required'
    isValid = false
  }
  
  return isValid
}

const saveUser = async () => {
  if (!validateForm()) return
  
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingUser.value) {
      const index = users.value.findIndex(u => u.id === editingUser.value?.id)
      if (index !== -1) {
        users.value[index] = {
          ...editingUser.value,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status
        }
      }
    } else {
      users.value.push({
        id: Math.random().toString(36).substr(2, 9),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        lastActive: new Date().toISOString()
      })
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  
  deleting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    users.value = users.value.filter(u => u.id !== userToDelete.value?.id)
    showDeleteConfirm.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('Error deleting user:', error)
  } finally {
    deleting.value = false
  }
}

const exportUsers = () => {
  // Implement export functionality
  console.log('Exporting users...')
}
</script> 