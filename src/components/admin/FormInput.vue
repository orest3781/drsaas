<!-- FormInput.vue -->
<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-white/80 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    
    <div :class="['relative', { 'mt-1': label }]">
      <!-- Text, Email, Password Inputs -->
      <template v-if="['text', 'email', 'password', 'number'].includes(type)">
        <div class="relative">
          <input
            :id="id"
            :type="showPassword ? 'text' : type"
            :value="modelValue"
            @input="handleInput"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
            :min="min"
            :max="max"
            :step="step"
            :class="[
              'w-full bg-white/5 border rounded-lg py-2 px-3 text-sm text-white placeholder-white/40 disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-error/50 focus:ring-error/50 focus:border-error/50'
                : 'border-white/10 focus:ring-primary/50 focus:border-primary/50',
              { 'pr-10': type === 'password' || clearable }
            ]"
          />
          
          <!-- Password Toggle -->
          <button
            v-if="type === 'password'"
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3"
            @click="showPassword = !showPassword"
          >
            <EyeIcon
              v-if="showPassword"
              class="h-5 w-5 text-white/40 hover:text-white/60"
            />
            <EyeSlashIcon
              v-else
              class="h-5 w-5 text-white/40 hover:text-white/60"
            />
          </button>

          <!-- Clear Button -->
          <button
            v-if="clearable && modelValue"
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3"
            @click="$emit('update:modelValue', '')"
          >
            <XMarkIcon class="h-5 w-5 text-white/40 hover:text-white/60" />
          </button>
        </div>
      </template>

      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="id"
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows"
        :class="[
          'w-full bg-white/5 border rounded-lg py-2 px-3 text-sm text-white placeholder-white/40 disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-error/50 focus:ring-error/50 focus:border-error/50'
            : 'border-white/10 focus:ring-primary/50 focus:border-primary/50'
        ]"
      ></textarea>

      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="id"
        :value="modelValue"
        @change="handleInput"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full bg-white/5 border rounded-lg py-2 pl-3 pr-10 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-error/50 focus:ring-error/50 focus:border-error/50'
            : 'border-white/10 focus:ring-primary/50 focus:border-primary/50'
        ]"
      >
        <option v-if="placeholder" value="" disabled selected>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Checkbox -->
      <div
        v-else-if="type === 'checkbox'"
        class="flex items-center"
      >
        <input
          :id="id"
          type="checkbox"
          :checked="modelValue"
          @change="handleInput"
          :required="required"
          :disabled="disabled"
          class="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          v-if="label"
          :for="id"
          class="ml-2 block text-sm text-white/80"
        >
          {{ label }}
          <span v-if="required" class="text-error">*</span>
        </label>
      </div>

      <!-- Radio -->
      <div
        v-else-if="type === 'radio'"
        class="space-y-2"
      >
        <div
          v-for="option in options"
          :key="option.value"
          class="flex items-center"
        >
          <input
            :id="`${id}-${option.value}`"
            type="radio"
            :name="id"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="handleInput"
            :required="required"
            :disabled="disabled"
            class="h-4 w-4 border-white/20 bg-white/5 text-primary focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            :for="`${id}-${option.value}`"
            class="ml-2 block text-sm text-white/80"
          >
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <p
      v-if="error"
      class="mt-2 text-sm text-error"
    >
      {{ error }}
    </p>

    <!-- Help Text -->
    <p
      v-if="helpText && !error"
      class="mt-2 text-sm text-white/40"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Option {
  label: string
  value: string | number | boolean
}

interface Props {
  modelValue: any
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  clearable?: boolean
  options?: Option[]
  rows?: number
  min?: number
  max?: number
  step?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  clearable: false,
  rows: 3,
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const showPassword = ref(false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  
  let value: any = target.value
  
  if (props.type === 'checkbox') {
    value = (target as HTMLInputElement).checked
  } else if (props.type === 'number') {
    value = target.value === '' ? '' : Number(target.value)
  }
  
  emit('update:modelValue', value)
}
</script> 