<!-- DataTable.vue -->
<template>
  <div class="overflow-hidden">
    <!-- Table Filters -->
    <div class="p-4 sm:p-6 border-b border-white/10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Search -->
        <div class="relative flex-1 max-w-sm">
          <input
            type="text"
            v-model="searchQuery"
            class="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            :placeholder="searchPlaceholder"
          />
          <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
        </div>

        <!-- Filters -->
        <div class="flex items-center space-x-2">
          <Menu as="div" class="relative" v-if="filters.length">
            <MenuButton class="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 border border-white/10">
              <FunnelIcon class="h-5 w-5" />
              <span>Filters</span>
              <ChevronDownIcon class="h-4 w-4 ml-1" />
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right bg-surface-dark rounded-lg shadow-lg border border-white/10 focus:outline-none z-10">
                <div class="py-1">
                  <MenuItem v-for="filter in filters" :key="filter.key" v-slot="{ active }">
                    <button
                      class="w-full text-left px-4 py-2 text-sm"
                      :class="[
                        active ? 'bg-white/10 text-white' : 'text-white/80',
                        selectedFilters.includes(filter.key) ? 'bg-primary/20' : ''
                      ]"
                      @click="toggleFilter(filter.key)"
                    >
                      {{ filter.label }}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <!-- Export -->
          <button 
            class="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 border border-white/10"
            @click="$emit('export')"
          >
            <ArrowDownTrayIcon class="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-white/10">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap"
              :class="{ 'cursor-pointer hover:text-white': column.sortable }"
              @click="column.sortable && sort(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <template v-if="column.sortable">
                  <ChevronUpIcon
                    v-if="sortKey === column.key && sortOrder === 'asc'"
                    class="h-4 w-4 text-primary"
                  />
                  <ChevronDownIcon
                    v-else-if="sortKey === column.key && sortOrder === 'desc'"
                    class="h-4 w-4 text-primary"
                  />
                  <ChevronUpDownIcon
                    v-else
                    class="h-4 w-4 text-white/20"
                  />
                </template>
              </div>
            </th>
            <th v-if="$slots.actions" scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap"
              >
                <div class="animate-pulse bg-white/10 h-4 rounded"></div>
              </td>
              <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-white/10 h-4 w-20 rounded"></div>
              </td>
            </tr>
          </template>
          <template v-else-if="filteredData.length">
            <tr
              v-for="item in paginatedData"
              :key="item.id"
              class="hover:bg-white/5 transition-colors"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap text-sm"
              >
                <slot
                  :name="column.key"
                  :item="item"
                  :value="item[column.key]"
                >
                  <span :class="column.class">{{ item[column.key] }}</span>
                </slot>
              </td>
              <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <slot name="actions" :item="item"></slot>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td
                :colspan="columns.length + ($slots.actions ? 1 : 0)"
                class="px-6 py-12 text-center text-sm text-white/40"
              >
                <div class="flex flex-col items-center">
                  <InboxIcon class="h-12 w-12 mb-4" />
                  <p>No results found</p>
                  <p v-if="searchQuery" class="mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-4 py-3 sm:px-6 border-t border-white/10 bg-surface-dark">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-white/40">
            Showing
            <span class="font-medium text-white">{{ paginationStart }}</span>
            to
            <span class="font-medium text-white">{{ paginationEnd }}</span>
            of
            <span class="font-medium text-white">{{ filteredData.length }}</span>
            results
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="[
              currentPage > 1
                ? 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10'
                : 'text-white/40 bg-white/5'
            ]"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </button>
          <button
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="[
              currentPage < totalPages
                ? 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10'
                : 'text-white/40 bg-white/5'
            ]"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  InboxIcon
} from '@heroicons/vue/24/outline'

interface Column {
  key: string
  label: string
  sortable?: boolean
  class?: string
}

interface Filter {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  data: any[]
  filters?: Filter[]
  loading?: boolean
  searchPlaceholder?: string
  itemsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  loading: false,
  searchPlaceholder: 'Search...',
  itemsPerPage: 10
})

const emit = defineEmits<{
  (e: 'update:sort', value: { key: string; order: 'asc' | 'desc' }): void
  (e: 'export'): void
}>()

// Search
const searchQuery = ref('')

// Sorting
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Filtering
const selectedFilters = ref<string[]>([])

// Pagination
const currentPage = ref(1)

const toggleFilter = (key: string) => {
  const index = selectedFilters.value.indexOf(key)
  if (index === -1) {
    selectedFilters.value.push(key)
  } else {
    selectedFilters.value.splice(index, 1)
  }
}

const sort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('update:sort', { key: sortKey.value, order: sortOrder.value })
}

const filteredData = computed(() => {
  let result = [...props.data]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      Object.values(item).some(
        value =>
          value &&
          value.toString().toLowerCase().includes(query)
      )
    )
  }

  // Apply filters
  if (selectedFilters.value.length) {
    result = result.filter(item =>
      selectedFilters.value.every(filter => item[filter])
    )
  }

  // Apply sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      
      if (aVal === bVal) return 0
      
      const comparison = aVal > bVal ? 1 : -1
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / props.itemsPerPage)
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredData.value.slice(start, end)
})

const paginationStart = computed(() =>
  (currentPage.value - 1) * props.itemsPerPage + 1
)

const paginationEnd = computed(() =>
  Math.min(currentPage.value * props.itemsPerPage, filteredData.value.length)
)

// Reset pagination when filters change
watch([searchQuery, selectedFilters], () => {
  currentPage.value = 1
})
</script> 