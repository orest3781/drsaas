<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-white">Shipment Management</h1>
      <button class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
        New Shipment
      </button>
    </div>
    <div class="flex items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <input type="text" placeholder="Search shipments..." class="w-full px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
      </div>
      <select class="px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
        <option value="">All Clients</option>
      </select>
      <select class="px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
        <option value="">All Projects</option>
      </select>
      <select class="px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
</script> 