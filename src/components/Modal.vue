<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-lg bg-surface-darker border border-white/10 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-white/10">
          <h3 class="text-lg font-medium text-white">
            <slot name="title"></slot>
          </h3>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <slot name="content"></slot>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-white/10">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script> 