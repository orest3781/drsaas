<template>
  <div class="min-h-screen bg-[#0f1729]">
    <div class="flex">
      <!-- Adjustable Left Navigation -->
      <div :class="[
        'bg-surface-dark border-r border-accent/20 h-screen transition-all duration-300 ease-in-out',
        isNavExpanded ? 'w-80' : 'w-20'
      ]">
        <div class="p-4 flex items-center justify-between">
          <h2 :class="[
            'text-lg font-semibold text-text-dark transition-opacity duration-300',
            isNavExpanded ? 'opacity-100' : 'opacity-0 hidden'
          ]">Navigation</h2>
          <button 
            @click="toggleNav"
            class="text-text-dark-light hover:text-accent p-1 rounded-lg hover:bg-accent/5 transition-colors"
          >
            <ChevronLeftIcon v-if="isNavExpanded" class="h-5 w-5" />
            <ChevronRightIcon v-else class="h-5 w-5" />
          </button>
        </div>
        <!-- Navigation Items -->
        <nav class="mt-4 px-2 overflow-hidden">
          <div class="space-y-2 overflow-y-auto overflow-x-hidden h-[calc(100vh-5rem)] scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-surface-darker">
            <!-- Navigation cards will be rendered with proper width constraints -->
            <div v-for="item in navigationItems" :key="item.id" 
              class="p-3 bg-surface-darker rounded-lg border border-accent/10 hover:border-accent/20 transition-colors cursor-pointer">
              <div :class="[
                'transition-all duration-300',
                isNavExpanded ? 'opacity-100' : 'opacity-0'
              ]">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-text-dark truncate">{{ item.title }}</span>
                  <span :class="`text-xs px-2 py-1 rounded-full ${item.priority === 'urgent' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`">
                    {{ item.priority }}
                  </span>
                </div>
                <p class="text-xs text-text-dark-light mt-1 truncate">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 p-6 overflow-hidden">
        <!-- Job Cards Section -->
        <div class="h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-surface-darker">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Job cards will be rendered here -->
          </div>
        </div>
      </div>
      
      <!-- Ready for Delivery Drawer -->
      <div class="w-96 bg-surface-dark border-l border-accent/20 h-screen overflow-hidden">
        <div class="p-4 border-b border-accent/20">
          <h2 class="text-lg font-semibold text-text-dark truncate">Ready for Delivery</h2>
        </div>
        <div class="h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-surface-darker p-4">
          <!-- Delivery cards will be rendered here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const isNavExpanded = ref(true)

const toggleNav = () => {
  isNavExpanded.value = !isNavExpanded.value
}

// Mock navigation items for demonstration
const navigationItems = ref([
  {
    id: 1,
    title: 'Client A - Project 1',
    description: 'Scanning in progress',
    priority: 'urgent'
  },
  {
    id: 2,
    title: 'Client B - Project 2',
    description: 'Quality check pending',
    priority: 'normal'
  },
  // Add more items as needed
])
</script>

<style>
/* Custom scrollbar styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thumb-accent\/20::-webkit-scrollbar-thumb {
  background-color: rgba(124, 58, 237, 0.2);
  border-radius: 3px;
}

.scrollbar-track-surface-darker::-webkit-scrollbar-track {
  background-color: #1e293b;
  border-radius: 3px;
}
</style>