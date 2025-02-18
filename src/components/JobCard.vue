<template>
  <div :class="[
    'border-l-4 rounded-lg p-4',
    isActive ? `bg-app-dark-card border-${getPriorityColor()}` : 'bg-app-dark-lighter border-gray-600 opacity-75'
  ]">
    <div class="flex justify-between items-start">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-app-text">{{ job.id }}</span>
        <span :class="[
          'px-2 py-1 text-xs font-medium rounded-full',
          `bg-${getPriorityColor()}-100 text-${getPriorityColor()}-800`
        ]">
          {{ job.priority }}
        </span>
      </div>
      <button class="text-app-text-secondary hover:text-app-text">
        <EllipsisVerticalIcon class="h-5 w-5" />
      </button>
    </div>

    <h3 class="mt-2 text-lg font-medium text-app-text">{{ job.title }}</h3>
    <p class="mt-1 text-sm text-app-text-secondary">{{ job.company }}</p>

    <div class="mt-4">
      <div class="flex items-center space-x-2">
        <div class="flex -space-x-2">
          <template v-for="user in job.team" :key="user.id">
            <img
              :src="user.avatar"
              :alt="user.name"
              class="h-6 w-6 rounded-full border-2 border-app-dark-card"
              :title="user.name"
            />
          </template>
        </div>
        <div class="flex items-center space-x-2 text-sm text-app-text-secondary">
          <component :is="getStatusIcon()" class="h-4 w-4" />
          <span>{{ job.status }}</span>
          <span>·</span>
          <span>{{ job.timeElapsed }}</span>
        </div>
      </div>
    </div>

    <div v-if="isActive" class="mt-4">
      <div class="w-full bg-app-dark rounded-full h-1.5">
        <div
          class="h-1.5 rounded-full"
          :class="`bg-${getPriorityColor()}`"
          :style="{ width: `${job.progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon } from '@heroicons/vue/24/solid'
import {
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

interface User {
  id: number
  name: string
  avatar: string
}

interface Job {
  id: string
  title: string
  company: string
  priority: 'urgent' | 'high' | 'normal'
  status: 'prep' | 'scanning' | 'qc' | 'complete'
  progress: number
  timeElapsed: string
  team: User[]
}

const props = defineProps<{
  job: Job
  isActive: boolean
}>()

const getPriorityColor = () => {
  switch (props.job.priority) {
    case 'urgent':
      return 'red'
    case 'high':
      return 'yellow'
    default:
      return 'green'
  }
}

const getStatusIcon = () => {
  switch (props.job.status) {
    case 'prep':
      return ClockIcon
    case 'scanning':
      return ArrowPathIcon
    case 'qc':
      return ExclamationCircleIcon
    case 'complete':
      return CheckCircleIcon
    default:
      return ClockIcon
  }
}
</script> 