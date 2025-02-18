export interface Job {
  id: number
  clientName: string
  projectName: string
  jobId: string
  operator: string
  currentStep: string
  status: string
  steps: {
    [key: string]: {
      progress: number
      operator: string | null
      lastUpdated: string | null
    }
  }
} 