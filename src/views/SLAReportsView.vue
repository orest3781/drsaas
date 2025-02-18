<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-white">SLA Reports</h1>
      <div class="flex items-center gap-4">
        <select class="px-4 py-2 bg-surface-dark text-white rounded-lg border border-white/10 focus:border-primary focus:outline-none">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>
        <button class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
          Export Report
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-surface-dark p-4 rounded-lg border border-white/10">
        <div class="text-sm text-white/60 mb-1">Overall Compliance</div>
        <div class="text-2xl font-semibold text-white">94.2%</div>
      </div>
      <div class="bg-surface-dark p-4 rounded-lg border border-white/10">
        <div class="text-sm text-white/60 mb-1">Total Shipments</div>
        <div class="text-2xl font-semibold text-white">1,284</div>
      </div>
      <div class="bg-surface-dark p-4 rounded-lg border border-white/10">
        <div class="text-sm text-white/60 mb-1">SLA Breaches</div>
        <div class="text-2xl font-semibold text-warning">74</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script> 