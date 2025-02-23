<template>
  <div class="space-y-6">
    <!-- General Settings -->
    <FormSection
      title="General Settings"
      submit-text="Save Changes"
      :loading="saving"
      @submit="saveSettings"
    >
      <div class="space-y-4">
        <FormInput
          v-model="settingsStore.general.companyName"
          label="Company Name"
          required
          :error="errors.companyName"
        />

        <FormInput
          v-model="settingsStore.general.timezone"
          type="select"
          label="Default Timezone"
          required
          :options="timezoneOptions"
          :error="errors.timezone"
        />

        <FormInput
          v-model="settingsStore.general.dateFormat"
          type="select"
          label="Date Format"
          required
          :options="dateFormatOptions"
          :error="errors.dateFormat"
        />

        <FormInput
          v-model="settingsStore.general.language"
          type="select"
          label="Default Language"
          required
          :options="languageOptions"
          :error="errors.language"
        />
      </div>
    </FormSection>

    <!-- Email Settings -->
    <FormSection
      title="Email Settings"
      submit-text="Save Email Settings"
      :loading="savingEmail"
      @submit="saveEmailSettings"
    >
      <div class="space-y-4">
        <FormInput
          v-model="settingsStore.email.smtpHost"
          label="SMTP Host"
          required
          :error="errors.smtpHost"
        />

        <FormInput
          v-model="settingsStore.email.smtpPort"
          type="number"
          label="SMTP Port"
          required
          :error="errors.smtpPort"
        />

        <FormInput
          v-model="settingsStore.email.smtpUser"
          label="SMTP Username"
          required
          :error="errors.smtpUser"
        />

        <FormInput
          v-model="settingsStore.email.smtpPassword"
          type="password"
          label="SMTP Password"
          required
          :error="errors.smtpPassword"
        />

        <FormInput
          v-model="settingsStore.email.senderEmail"
          type="email"
          label="Sender Email"
          required
          :error="errors.senderEmail"
        />
      </div>
    </FormSection>

    <!-- Notification Settings -->
    <FormSection
      title="Notification Settings"
      submit-text="Save Notification Settings"
      :loading="savingNotifications"
      @submit="saveNotificationSettings"
    >
      <div class="space-y-4">
        <FormInput
          v-model="settingsStore.notifications.enableEmailNotifications"
          type="checkbox"
          label="Enable Email Notifications"
        />

        <FormInput
          v-model="settingsStore.notifications.enableSystemNotifications"
          type="checkbox"
          label="Enable System Notifications"
        />

        <FormInput
          v-model="settingsStore.notifications.notifyOnNewProject"
          type="checkbox"
          label="Notify on New Project"
        />

        <FormInput
          v-model="settingsStore.notifications.notifyOnProjectComplete"
          type="checkbox"
          label="Notify on Project Completion"
        />

        <FormInput
          v-model="settingsStore.notifications.notifyOnSLABreach"
          type="checkbox"
          label="Notify on SLA Breach"
        />
      </div>
    </FormSection>

    <!-- Backup Settings -->
    <FormSection
      title="Backup Settings"
      submit-text="Save Backup Settings"
      :loading="savingBackup"
      @submit="saveBackupSettings"
    >
      <div class="space-y-4">
        <FormInput
          v-model="settingsStore.backup.enableAutoBackup"
          type="checkbox"
          label="Enable Automatic Backups"
        />

        <FormInput
          v-model="settingsStore.backup.backupFrequency"
          type="select"
          label="Backup Frequency"
          :options="backupFrequencyOptions"
          :disabled="!settingsStore.backup.enableAutoBackup"
        />

        <FormInput
          v-model="settingsStore.backup.backupRetention"
          type="select"
          label="Backup Retention"
          :options="backupRetentionOptions"
          :disabled="!settingsStore.backup.enableAutoBackup"
        />

        <FormInput
          v-model="settingsStore.backup.backupLocation"
          label="Backup Location"
          :disabled="!settingsStore.backup.enableAutoBackup"
          help-text="Path to store backup files"
        />
      </div>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import FormSection from '@/components/admin/FormSection.vue'
import FormInput from '@/components/admin/FormInput.vue'
import { useSettingsStore } from '@/stores/settings'

// Initialize settings store
const settingsStore = useSettingsStore()

// Form States
const saving = ref(false)
const savingEmail = ref(false)
const savingNotifications = ref(false)
const savingBackup = ref(false)

// Form Errors
const errors = reactive({
  companyName: '',
  timezone: '',
  dateFormat: '',
  language: '',
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPassword: '',
  senderEmail: ''
})

// Options for Select Inputs
const timezoneOptions = [
  { label: 'UTC', value: 'UTC' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' }
]

const dateFormatOptions = [
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
]

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' }
]

const backupFrequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
]

const backupRetentionOptions = [
  { label: '7 Days', value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: '90 Days', value: '90days' },
  { label: '1 Year', value: '1year' }
]

// Save Methods
const saveSettings = async () => {
  saving.value = true
  try {
    const success = await settingsStore.updateGeneralSettings({
      companyName: settingsStore.general.companyName,
      timezone: settingsStore.general.timezone,
      dateFormat: settingsStore.general.dateFormat,
      language: settingsStore.general.language
    })
    if (!success) throw new Error('Failed to save general settings')
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    saving.value = false
  }
}

const saveEmailSettings = async () => {
  savingEmail.value = true
  try {
    const success = await settingsStore.updateEmailSettings({
      smtpHost: settingsStore.email.smtpHost,
      smtpPort: settingsStore.email.smtpPort,
      smtpUser: settingsStore.email.smtpUser,
      smtpPassword: settingsStore.email.smtpPassword,
      senderEmail: settingsStore.email.senderEmail
    })
    if (!success) throw new Error('Failed to save email settings')
  } catch (error) {
    console.error('Error saving email settings:', error)
  } finally {
    savingEmail.value = false
  }
}

const saveNotificationSettings = async () => {
  savingNotifications.value = true
  try {
    const success = await settingsStore.updateNotificationSettings({
      enableEmailNotifications: settingsStore.notifications.enableEmailNotifications,
      enableSystemNotifications: settingsStore.notifications.enableSystemNotifications,
      notifyOnNewProject: settingsStore.notifications.notifyOnNewProject,
      notifyOnProjectComplete: settingsStore.notifications.notifyOnProjectComplete,
      notifyOnSLABreach: settingsStore.notifications.notifyOnSLABreach
    })
    if (!success) throw new Error('Failed to save notification settings')
  } catch (error) {
    console.error('Error saving notification settings:', error)
  } finally {
    savingNotifications.value = false
  }
}

const saveBackupSettings = async () => {
  savingBackup.value = true
  try {
    const success = await settingsStore.updateBackupSettings({
      enableAutoBackup: settingsStore.backup.enableAutoBackup,
      backupFrequency: settingsStore.backup.backupFrequency,
      backupRetention: settingsStore.backup.backupRetention,
      backupLocation: settingsStore.backup.backupLocation
    })
    if (!success) throw new Error('Failed to save backup settings')
  } catch (error) {
    console.error('Error saving backup settings:', error)
  } finally {
    savingBackup.value = false
  }
}
</script> 