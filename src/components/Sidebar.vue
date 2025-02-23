<template>
  <div 
    v-if="!isAuthPage"
    class="h-screen w-64 bg-surface-dark border-r border-accent/20 fixed left-0 top-0"
  >
    <div class="p-4">
      <!-- Logo -->
      <div class="h-16 flex items-center flex-col justify-center">
        <div class="text-lg font-bold tracking-wider flex items-center gap-[1px]">
          <span class="bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">Med</span>
          <span class="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">Atlas</span>
        </div>
        <div class="ekg-line w-24 mt-1">
          <svg width="100%" height="20" viewBox="0 0 120 20" preserveAspectRatio="none">
            <path
              class="ekg-path"
              d="M 0,10 
                 L 18,10 
                 L 20,10 
                 L 22,4 
                 L 24,16 
                 L 26,2 
                 L 28,18 
                 L 30,10 
                 L 32,10 
                 L 120,10"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              pathLength="100"
            />
          </svg>
        </div>
        <span class="text-white/40 text-[10px] mt-1">Advanced Tracking, Logistics, and Administration System</span>
      </div>

      <!-- Administration Section -->
      <div class="mb-8">
        <h3 class="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
          Administration
        </h3>
        <nav class="space-y-2">
          <router-link
            v-for="item in adminItems"
            :key="item.name"
            :to="item.href"
            :class="[
              item.current
                ? 'bg-accent/10 text-accent border-l-2 border-accent'
                : 'text-text-dark-light hover:bg-accent/5 hover:text-accent',
              'group flex items-center px-3 py-2.5 text-sm font-medium rounded-r-md transition-colors'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                item.current ? 'text-accent' : 'text-text-dark-light group-hover:text-accent',
                'flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors'
              ]"
              aria-hidden="true"
            />
            <span class="truncate">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Production Section -->
      <div>
        <h3 class="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
          Production
        </h3>
        <nav class="space-y-2">
          <router-link
            v-for="item in productionItems"
            :key="item.name"
            :to="item.href"
            :class="[
              item.current
                ? 'bg-accent/10 text-accent border-l-2 border-accent'
                : 'text-text-dark-light hover:bg-accent/5 hover:text-accent',
              'group flex items-center px-3 py-2.5 text-sm font-medium rounded-r-md transition-colors'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                item.current ? 'text-accent' : 'text-text-dark-light group-hover:text-accent',
                'flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors'
              ]"
              aria-hidden="true"
            />
            <span class="truncate">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Active Operators Section -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-accent/20 bg-surface-darker">
      <h3 class="text-sm font-medium text-text-dark-light mb-2">Active Operators</h3>
      <div class="flex items-center space-x-2">
        <span class="flex h-2 w-2 rounded-full bg-success"></span>
        <span class="text-sm text-text-dark">8 Online</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Squares2X2Icon as DashboardIcon,
  UserGroupIcon,
  BuildingOffice2Icon as ClientsIcon,
  InboxArrowDownIcon as InboxInIcon,
  TruckIcon,
  BuildingOfficeIcon as OfficeBuildingIcon,
  TrashIcon,
  ChartBarIcon,
  Cog6ToothIcon as CogIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

interface NavigationItem {
  name: string
  href: string
  icon: any // Using any for Heroicon components as they don't have proper types
  current: boolean
  section: 'admin' | 'production'
}

const route = useRoute()
const authStore = useAuthStore()

// Group navigation items by section
const navigationItems = ref<NavigationItem[]>([
  // Administration Section
  { name: 'Clients', href: '/admin/clients', icon: ClientsIcon, current: false, section: 'admin' },
  { name: 'Projects', href: '/admin/projects', icon: FolderIcon, current: false, section: 'admin' },
  { name: 'Employees', href: '/admin/employees', icon: UserGroupIcon, current: false, section: 'admin' },
  
  // Production Section
  { name: 'Production Dashboard', href: '/', icon: DashboardIcon, current: true, section: 'production' },
  { name: 'Project Management', href: '/projects', icon: ChartBarIcon, current: false, section: 'production' },
  { name: 'Receiving', href: '/receiving', icon: ArrowDownTrayIcon, current: false, section: 'production' },
  { name: 'Delivery', href: '/delivery', icon: TruckIcon, current: false, section: 'production' },
  { name: 'Office Map', href: '/office-map', icon: OfficeBuildingIcon, current: false, section: 'production' },
  { name: 'Destruction', href: '/destruction', icon: TrashIcon, current: false, section: 'production' },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false, section: 'production' }
])

// Computed properties for filtered items
const adminItems = computed(() => 
  navigationItems.value.filter(item => item.section === 'admin' && authStore.isAdmin)
)

const productionItems = computed(() => 
  navigationItems.value.filter(item => {
    if (item.section !== 'production') return false
    if (item.href === '/receiving' && !authStore.canAccessReceiving) return false
    return true
  })
)

// Update current based on route
const updateCurrent = () => {
  navigationItems.value = navigationItems.value.map(item => ({
    ...item,
    current: item.href === route.path
  }))
}

// Watch for route changes
route.path && updateCurrent()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/signin' || route.path === '/sign-in'
})
</script>

<style scoped>
.ekg-line {
  @apply text-sky-400/60;
  pointer-events: none;
}

.ekg-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: ekg-draw 2s linear infinite;
}

@keyframes ekg-draw {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: -100;
  }
}
</style> 