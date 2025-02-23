import { defineStore } from 'pinia'

interface GeneralSettings {
  companyName: string
  timezone: string
  dateFormat: string
  language: string
}

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  senderEmail: string
}

interface NotificationSettings {
  enableEmailNotifications: boolean
  enableSystemNotifications: boolean
  notifyOnNewProject: boolean
  notifyOnProjectComplete: boolean
  notifyOnSLABreach: boolean
}

interface BackupSettings {
  enableAutoBackup: boolean
  backupFrequency: string
  backupRetention: string
  backupLocation: string
}

interface Settings {
  general: GeneralSettings
  email: EmailSettings
  notifications: NotificationSettings
  backup: BackupSettings
}

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    general: {
      companyName: 'MedAtlas',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      language: 'en'
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      senderEmail: ''
    },
    notifications: {
      enableEmailNotifications: true,
      enableSystemNotifications: true,
      notifyOnNewProject: true,
      notifyOnProjectComplete: true,
      notifyOnSLABreach: true
    },
    backup: {
      enableAutoBackup: true,
      backupFrequency: 'daily',
      backupRetention: '30days',
      backupLocation: '/backups'
    }
  }),

  actions: {
    async updateGeneralSettings(settings: Partial<GeneralSettings>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.general = { ...this.general, ...settings }
        return true
      } catch (error) {
        console.error('Error updating general settings:', error)
        return false
      }
    },

    async updateEmailSettings(settings: Partial<EmailSettings>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.email = { ...this.email, ...settings }
        return true
      } catch (error) {
        console.error('Error updating email settings:', error)
        return false
      }
    },

    async updateNotificationSettings(settings: Partial<NotificationSettings>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.notifications = { ...this.notifications, ...settings }
        return true
      } catch (error) {
        console.error('Error updating notification settings:', error)
        return false
      }
    },

    async updateBackupSettings(settings: Partial<BackupSettings>) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.backup = { ...this.backup, ...settings }
        return true
      } catch (error) {
        console.error('Error updating backup settings:', error)
        return false
      }
    }
  }
}) 