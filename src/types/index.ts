export interface Job {
  id: number
  clientName: string
  projectName: string
  jobId: string
  operator: string | null
  currentStep: string
  status: string
  holdReason?: string
  steps: {
    [key: string]: {
      progress: number
      operator: string | null
      lastUpdated: string | null
    }
  }
}

export interface Client {
  id: string
  name: string
  hasUrgent: boolean
  totalBoxes: number
  projects: Project[]
}

export interface Project {
  id: string
  name: string
  sla: string
  deadline: string
  shipments: Shipment[]
}

export interface Shipment {
  id: string
  boxType: 'Standard' | 'Long'
  receivedAt: string
  isUrgent: boolean
} 