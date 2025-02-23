<!-- MedAtlasLogo.vue -->
<template>
  <div class="logo-container" :class="sizeClass">
    <svg
      :width="width"
      :height="height"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Base Circle -->
      <circle 
        cx="20" 
        cy="20" 
        r="18" 
        class="logo-circle" 
        :class="colorClass" 
      />
      
      <!-- Variant 1: Binary Ring -->
      <g v-if="props.design === 'binary'" class="binary-ring">
        <path
          d="M20 5A15 15 0 1 1 5 20"
          stroke="currentColor"
          stroke-width="0.5"
          stroke-dasharray="2 3"
          class="binary-path"
        />
        <text
          class="binary-text"
          x="20"
          y="8"
          font-size="2"
          fill="currentColor"
        >101010</text>
      </g>

      <!-- Variant 2: Data Pulse -->
      <g v-if="props.design === 'pulse'" class="data-pulse">
        <path
          d="M10 20h5l2-8 4 16 2-8h7"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          class="pulse-line"
        />
        <circle
          cx="20"
          cy="20"
          r="1"
          fill="currentColor"
          class="pulse-dot"
        />
      </g>

      <!-- Variant 3: Network Nodes -->
      <g v-if="props.design === 'network'" class="network-nodes">
        <circle cx="15" cy="15" r="1" fill="currentColor" class="node" />
        <circle cx="25" cy="15" r="1" fill="currentColor" class="node" />
        <circle cx="20" cy="25" r="1" fill="currentColor" class="node" />
        <path
          d="M15 15L25 15M15 15L20 25M25 15L20 25"
          stroke="currentColor"
          stroke-width="0.5"
          class="node-line"
        />
      </g>

      <!-- Variant 4: DNA Data -->
      <g v-if="props.design === 'dna'" class="dna-helix">
        <path
          d="M15 12C15 12 20 15 25 12M15 16C15 16 20 19 25 16M15 20C15 20 20 23 25 20"
          stroke="currentColor"
          stroke-width="0.5"
          stroke-linecap="round"
          class="helix-line"
        />
        <text
          x="17"
          y="14"
          font-size="2"
          fill="currentColor"
          class="binary-text"
        >01</text>
      </g>

      <!-- Variant 5: Circuit Cross -->
      <g v-if="props.design === 'circuit'" class="circuit-cross">
        <path
          d="M20 10V30M10 20H30"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          class="cross-line"
        />
        <circle cx="20" cy="20" r="2" fill="currentColor" class="circuit-node" />
        <circle cx="15" cy="20" r="1" fill="currentColor" class="data-point" />
        <circle cx="25" cy="20" r="1" fill="currentColor" class="data-point" />
      </g>

      <!-- Variant 6: Wireframe Globe -->
      <g v-if="props.design === 'globe'" class="globe">
        <!-- Latitude Lines (Horizontal) -->
        <path
          v-for="i in 3"
          :key="'lat'+i"
          :d="`M10 ${14 + i * 4}C15 ${14 + i * 4} 25 ${14 + i * 4} 30 ${14 + i * 4}`"
          class="globe-line latitude"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
        />
        
        <!-- Longitude Lines (Vertical curved) -->
        <path
          d="M15 10C15 15 15 25 15 30"
          class="globe-line longitude"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
        />
        <path
          d="M20 10C20 15 20 25 20 30"
          class="globe-line longitude"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
        />
        <path
          d="M25 10C25 15 25 25 25 30"
          class="globe-line longitude"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
        />

        <!-- Curved Longitude Lines -->
        <path
          d="M12 15Q20 20 28 15"
          class="globe-line longitude-curve"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
        />
        <path
          d="M12 25Q20 20 28 25"
          class="globe-line longitude-curve"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
        />

        <!-- Equator Line (bolder) -->
        <path
          d="M10 20C15 20 25 20 30 20"
          class="globe-line equator"
          stroke="currentColor"
          stroke-width="1"
          fill="none"
        />

        <!-- Data Points at intersections -->
        <circle
          v-for="(point, index) in globePoints"
          :key="'p'+index"
          :cx="point.x"
          :cy="point.y"
          r="0.5"
          class="data-point"
          fill="currentColor"
        />
      </g>

    </svg>
    <span v-if="showText" class="logo-text" :class="[textSizeClass, colorClass]">
      MedAtlas
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
  showText?: boolean
  animate?: boolean
  design?: 'binary' | 'pulse' | 'network' | 'dna' | 'circuit' | 'globe'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'light',
  showText: true,
  animate: false,
  design: 'circuit'
})

const sizeMap = {
  sm: { width: 24, height: 24, textSize: 'text-sm' },
  md: { width: 32, height: 32, textSize: 'text-lg' },
  lg: { width: 40, height: 40, textSize: 'text-xl' },
  xl: { width: 80, height: 80, textSize: 'text-3xl' }
}

const width = computed(() => sizeMap[props.size].width)
const height = computed(() => sizeMap[props.size].height)
const textSizeClass = computed(() => sizeMap[props.size].textSize)
const colorClass = computed(() => props.variant === 'light' ? 'text-white' : 'text-primary')
const sizeClass = computed(() => `logo-${props.size}`)

// Add globe points for intersections
const globePoints = [
  { x: 15, y: 14 },
  { x: 20, y: 14 },
  { x: 25, y: 14 },
  { x: 15, y: 18 },
  { x: 20, y: 18 },
  { x: 25, y: 18 },
  { x: 15, y: 22 },
  { x: 20, y: 22 },
  { x: 25, y: 22 },
]
</script>

<style scoped>
.logo-container {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-circle {
  fill: currentColor;
  opacity: 0.1;
  transform-origin: center;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo-text {
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* Size variants */
.logo-sm { gap: 0.25rem; }
.logo-md { gap: 0.5rem; }
.logo-lg { gap: 0.75rem; }
.logo-xl { gap: 1rem; }

/* Static styles for variants */
.binary-path {
  opacity: 0.6;
}

.binary-text {
  opacity: 0.8;
}

.pulse-line {
  opacity: 0.8;
}

.pulse-dot {
  opacity: 0.8;
}

.network-nodes .node {
  opacity: 0.8;
}

.node-line {
  opacity: 0.6;
}

.helix-line {
  opacity: 0.7;
}

.circuit-cross .cross-line {
  opacity: 0.8;
}

.circuit-node {
  opacity: 0.8;
}

.data-point {
  opacity: 0.7;
}

/* Globe static styles */
.globe {
  transform-origin: center;
}

.globe-line {
  opacity: 0.4;
}

.globe-line.longitude-curve {
  opacity: 0.3;
}

.globe-line.equator {
  opacity: 0.6;
}

.globe .data-point {
  opacity: 0.5;
}
</style>