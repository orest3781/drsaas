<template>
  <div class="h-screen w-64 bg-surface-dark border-r border-accent/20 fixed left-0 top-0">
    <div class="p-4">
      <h2 class="text-lg font-semibold text-text-dark mb-6">Navigation</h2>
      <nav class="space-y-1">
        <a
          v-for="item in navigationItems"
          :key="item.name"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-accent/10 text-accent border-l-2 border-accent'
              : 'text-text-dark-light hover:bg-accent/5 hover:text-accent',
            'group flex items-center px-3 py-2 text-sm font-medium rounded-r-md transition-colors'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              item.current ? 'text-accent' : 'text-text-dark-light group-hover:text-accent',
              'flex-shrink-0 -ml-1 mr-3 h-6 w-6 transition-colors'
            ]"
            aria-hidden="true"
          />
          <span class="truncate">{{ item.name }}</span>
        </a>
      </nav>
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
  ListBulletIcon as ViewListIcon,
  UsersIcon as UserGroupIcon,
  InboxArrowDownIcon as InboxInIcon,
  TruckIcon,
  BuildingOfficeIcon as OfficeBuildingIcon,
  TrashIcon,
  ChartBarIcon,
  Cog6ToothIcon as CogIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const navigationItems = ref([
  { name: 'Production Dashboard', href: '/', icon: ViewListIcon, current: true },
  { name: 'Administration', href: '/admin', icon: UserGroupIcon, current: false },
  { name: 'Project Management', href: '/projects', icon: ChartBarIcon, current: false },
  { name: 'Receiving', href: '/receiving', icon: InboxInIcon, current: false },
  { name: 'Delivery', href: '/delivery', icon: TruckIcon, current: false },
  { name: 'Office Map', href: '/office-map', icon: OfficeBuildingIcon, current: false },
  { name: 'Destruction', href: '/destruction', icon: TrashIcon, current: false },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Settings', href: '/settings', icon: CogIcon, current: false },
])
</script> 