import { defineStore } from 'pinia'

interface KioskUser {
  username: string
  role: 'KIOSK_OPERATOR' | 'KIOSK_SUPERVISOR'
}

interface KioskState {
  isAuthenticated: boolean
  user: KioskUser | null
  error: string | null
}

// In a real application, these would be stored securely and not in the code
const VALID_USERS = [
  {
    username: 'kiosk',
    password: 'medatlas2024',
    role: 'KIOSK_OPERATOR'
  },
  {
    username: 'supervisor',
    password: 'atlas2024',
    role: 'KIOSK_SUPERVISOR'
  }
]

export const useKioskStore = defineStore('kiosk', {
  state: (): KioskState => ({
    isAuthenticated: false,
    user: null,
    error: null
  }),

  getters: {
    isKioskOperator: (state) => state.user?.role === 'KIOSK_OPERATOR',
    isKioskSupervisor: (state) => state.user?.role === 'KIOSK_SUPERVISOR'
  },

  actions: {
    async login(username: string, password: string) {
      this.error = null
      
      const user = VALID_USERS.find(u => 
        u.username === username && u.password === password
      )

      if (user) {
        this.isAuthenticated = true
        this.user = {
          username: user.username,
          role: user.role as KioskUser['role']
        }
        return true
      }

      this.error = 'Invalid credentials'
      return false
    },

    logout() {
      this.isAuthenticated = false
      this.user = null
      this.error = null
    }
  }
}) 