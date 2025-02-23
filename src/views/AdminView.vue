<template>
  <AdminLayout>
    <router-view v-slot="{ Component }">
      <Suspense>
        <template #default>
          <keep-alive>
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </template>
        <template #fallback>
          <div class="p-8 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </template>
      </Suspense>
    </router-view>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

onErrorCaptured((error) => {
  console.error('Error in admin view:', error)
  return false // Prevent error from propagating
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 