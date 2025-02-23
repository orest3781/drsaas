import { defineStore } from 'pinia'

export type UserRole = 'PRODUCTION_TECHNICIAN' | 'LEAD_PRODUCTION_TECHNICIAN' | 'SUPERVISOR' | 'ADMIN'

interface User {
  id: string
  name: string
  role: UserRole
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  permissions: UserPermissions
}

interface UserPermissions {
  canCreateClient: boolean;
  canEditClient: boolean;
  canViewProjects: boolean;
  canToggleClientStatus: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    // Mock user permissions - in real app these would come from backend
    permissions: {
      canCreateClient: true,
      canEditClient: false,
      canViewProjects: true,
      canToggleClientStatus: false
    }
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isSupervisor: (state) => state.user?.role === 'SUPERVISOR',
    isLeadTechnician: (state) => state.user?.role === 'LEAD_PRODUCTION_TECHNICIAN',
    isTechnician: (state) => state.user?.role === 'PRODUCTION_TECHNICIAN',
    
    // Permission-based getters
    canAccessReceiving: (state) => {
      if (!state.user) return false
      return ['PRODUCTION_TECHNICIAN', 'LEAD_PRODUCTION_TECHNICIAN', 'SUPERVISOR', 'ADMIN'].includes(state.user.role)
    },
    canModifyPriority: (state) => {
      if (!state.user) return false
      return ['LEAD_PRODUCTION_TECHNICIAN', 'SUPERVISOR', 'ADMIN'].includes(state.user.role)
    },
    canAccessReports: (state) => {
      if (!state.user) return false
      return ['SUPERVISOR', 'ADMIN'].includes(state.user.role)
    },
    hasPermission: (state) => (permission: keyof UserPermissions) => {
      return state.permissions[permission]
    }
  },

  actions: {
    async login(username: string, password: string) {
      // Mock login - replace with actual API call
      const mockUsers: Record<string, User> = {
        admin: {
          id: '1',
          name: 'Admin User',
          role: 'ADMIN',
          email: 'admin@example.com'
        },
        supervisor: {
          id: '2',
          name: 'Supervisor User',
          role: 'SUPERVISOR',
          email: 'supervisor@example.com'
        },
        lead: {
          id: '3',
          name: 'Lead Technician',
          role: 'LEAD_PRODUCTION_TECHNICIAN',
          email: 'lead@example.com'
        },
        tech: {
          id: '4',
          name: 'Production Technician',
          role: 'PRODUCTION_TECHNICIAN',
          email: 'tech@example.com'
        }
      }

      const user = mockUsers[username]
      if (user && password === 'password') {
        this.user = user
        this.isAuthenticated = true
        return true
      }
      throw new Error('Invalid credentials')
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
    }
  }
}) 