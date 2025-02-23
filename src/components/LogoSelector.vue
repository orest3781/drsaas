<template>
  <div class="logo-selector">
    <div class="flex flex-col items-center space-y-6">
      <!-- Logo Display -->
      <MedAtlasLogo 
        :design="selectedDesign"
        size="xl"
        animate
        class="transform transition-all duration-500"
      />
      
      <!-- Design Buttons -->
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="design in designs"
          :key="design.id"
          @click="selectedDesign = design.id"
          :class="[
            'px-4 py-2 rounded-lg transition-all duration-300 transform',
            'flex items-center space-x-2 group',
            selectedDesign === design.id
              ? 'bg-primary text-white scale-105 shadow-lg'
              : 'bg-surface-dark text-white/70 hover:bg-surface-darker hover:text-white hover:scale-102'
          ]"
        >
          <span 
            :class="[
              'w-2 h-2 rounded-full transition-all duration-300',
              selectedDesign === design.id
                ? 'bg-white scale-125'
                : 'bg-white/50 group-hover:bg-white/70'
            ]"
          ></span>
          <span>{{ design.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MedAtlasLogo from './MedAtlasLogo.vue'

const designs = [
  { id: 'globe', name: 'Atlas Globe' },
  { id: 'binary', name: 'Binary Ring' },
  { id: 'pulse', name: 'Data Pulse' },
  { id: 'network', name: 'Network' },
  { id: 'dna', name: 'DNA Data' },
  { id: 'circuit', name: 'Circuit' }
] as const

const selectedDesign = ref<typeof designs[number]['id']>('globe')
</script>

<style scoped>
.logo-selector {
  @apply p-6 rounded-xl bg-surface-darker/50 backdrop-blur-sm;
}

/* Custom scale for hover */
.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style> 