<!-- FormSection.vue -->
<template>
  <div class="bg-surface-dark border border-white/10 rounded-lg overflow-hidden">
    <!-- Section Header -->
    <div class="px-4 py-5 sm:px-6 border-b border-white/10">
      <h3 class="text-lg font-medium text-white">
        <slot name="title">{{ title }}</slot>
      </h3>
      <p v-if="$slots.description" class="mt-1 text-sm text-white/60">
        <slot name="description"></slot>
      </p>
    </div>

    <!-- Form Content -->
    <div class="px-4 py-5 sm:p-6">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <slot></slot>

          <!-- Form Actions -->
          <div v-if="$slots.actions || showDefaultActions" class="flex items-center justify-end space-x-3">
            <slot name="actions">
              <button
                v-if="showCancelButton"
                type="button"
                class="px-4 py-2 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                @click="$emit('cancel')"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading || disabled"
                class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                <span :class="{ 'opacity-0': loading }">
                  <slot name="submit-text">{{ submitText }}</slot>
                </span>
                <div
                  v-if="loading"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <svg
                    class="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </button>
            </slot>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  submitText?: string
  loading?: boolean
  disabled?: boolean
  showDefaultActions?: boolean
  showCancelButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  submitText: 'Save Changes',
  loading: false,
  disabled: false,
  showDefaultActions: true,
  showCancelButton: true
})

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const handleSubmit = () => {
  if (!props.loading && !props.disabled) {
    emit('submit')
  }
}
</script>

<style scoped>
.form-error {
  @apply mt-2 text-sm text-error;
}

.form-helper {
  @apply mt-2 text-sm text-white/40;
}

/* Input focus styles */
:deep(input:focus),
:deep(select:focus),
:deep(textarea:focus) {
  @apply ring-2 ring-primary/50 border-primary/50;
}

/* Input error styles */
:deep(.has-error input),
:deep(.has-error select),
:deep(.has-error textarea) {
  @apply border-error/50 focus:ring-error/50 focus:border-error/50;
}

/* Disabled state styles */
:deep(input:disabled),
:deep(select:disabled),
:deep(textarea:disabled) {
  @apply opacity-50 cursor-not-allowed;
}

/* Custom checkbox styles */
:deep(.custom-checkbox) {
  @apply relative flex items-start py-1;
}

:deep(.custom-checkbox input[type="checkbox"]) {
  @apply h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50;
}

:deep(.custom-checkbox input[type="checkbox"]:checked) {
  @apply bg-primary border-primary;
}

/* Custom radio styles */
:deep(.custom-radio) {
  @apply relative flex items-start py-1;
}

:deep(.custom-radio input[type="radio"]) {
  @apply h-4 w-4 border-white/20 bg-white/5 text-primary focus:ring-primary/50;
}

:deep(.custom-radio input[type="radio"]:checked) {
  @apply bg-primary border-primary;
}

/* Label styles */
:deep(label) {
  @apply block text-sm font-medium text-white/80 mb-1;
}

/* Input group styles */
:deep(.input-group) {
  @apply flex rounded-lg overflow-hidden;
}

:deep(.input-group input) {
  @apply flex-1 rounded-none focus:z-10;
}

:deep(.input-group > :first-child) {
  @apply rounded-l-lg;
}

:deep(.input-group > :last-child) {
  @apply rounded-r-lg;
}

/* Input addon styles */
:deep(.input-addon) {
  @apply flex items-center px-3 text-sm text-white/40 bg-white/5 border border-white/10;
}

/* Help text styles */
:deep(.help-text) {
  @apply mt-2 text-sm text-white/40;
}
</style> 