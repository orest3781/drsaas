<template>
  <div class="h-16 bg-surface-dark border-b border-accent/20 fixed top-0 left-8 right-8 z-50">
    <div class="h-full px-4 flex items-center justify-between">
      <!-- Logo and System Name -->
      <div class="flex items-center">
        <div class="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <ListBulletIcon class="h-5 w-5 text-white" />
        </div>
        <div class="ml-3">
          <h1 class="text-text-dark font-medium">Production Management System</h1>
        </div>
      </div>

      <!-- Center Section - Search -->
      <div class="flex-1 max-w-xl mx-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-text-light" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search jobs..."
            class="block w-full pl-10 pr-3 py-2 border border-accent/20 rounded-md leading-5 bg-surface-darker text-text-dark placeholder-text-light focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-colors"
          />
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center space-x-4">
        <!-- New Job Button -->
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
          <PlusIcon class="h-5 w-5 mr-1" />
          New Job
        </button>

        <!-- Notifications -->
        <button class="p-2 rounded-full text-text-dark-light hover:bg-accent/5 hover:text-accent focus:outline-none transition-colors">
          <BellIcon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Theme Toggle -->
        <button class="p-2 rounded-full text-text-dark-light hover:bg-accent/5 hover:text-accent focus:outline-none transition-colors">
          <MoonIcon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Operations -->
        <div class="flex items-center space-x-2">
          <img
            class="h-8 w-8 rounded-full ring-2 ring-accent/20"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <span class="text-text-dark text-sm font-medium">Operations</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
  MoonIcon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'
</script> 