<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-white">Project Management</h1>
      <button class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
        New Project
      </button>
    </div>
    <div class="flex items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <input type="text" placeholder="Search projects..." class="w-full px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
      </div>
      <select class="px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
        <option value="all">All Projects</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <select class="px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
        <option value="">All Clients</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
</script> 