<template>
  <div class="bg-surface-dark rounded-lg p-5 border border-accent/10 hover:border-accent/20 transition-colors">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="`${color} rounded-lg p-3`">
          <component
            :is="icon"
            class="h-6 w-6"
            aria-hidden="true"
          />
        </div>
      </div>
      <div class="ml-4 flex-1">
        <h3 class="text-sm font-medium text-text-dark-light">{{ title }}</h3>
        <div class="mt-1">
          <p class="text-2xl font-semibold text-text-dark">{{ value }}</p>
          <div class="mt-1 flex items-center">
            <span :class="[
              type === 'increase' ? 'text-success' : 'text-error',
              'text-sm font-medium flex items-center'
            ]">
              <component
                :is="type === 'increase' ? 'ArrowUpIcon' : 'ArrowDownIcon'"
                class="h-4 w-4 mr-1"
              />
              {{ change }}%
            </span>
            <span class="ml-2 text-sm text-text-dark-light">{{ timeframe }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  value: string | number
  change: string | number
  timeframe: string
  type: 'increase' | 'decrease'
  icon: Component
  color: string
}>()
</script> 