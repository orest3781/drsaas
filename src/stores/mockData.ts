import type { Job } from '../types'

const getTodayAt = (hour: number, minute: number = 0) => {
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const getTimestampWithinRange = (hoursAgo: number) => {
  const now = new Date()
  now.setHours(now.getHours() - hoursAgo)
  return now.toISOString()
}

export const mockJobs: Job[] = [
  {
    id: 1,
    clientName: 'Acme Corp',
    projectName: 'Annual Reports 2024',
    jobId: 'C0001P001B00001',
    operator: 'John Doe',
    currentStep: 'QC',
    status: 'In Progress',
    steps: {
      PREP: { progress: 100, operator: 'Sarah Wilson', lastUpdated: getTimestampWithinRange(2.5) },
      SCAN: { progress: 100, operator: 'Mike Johnson', lastUpdated: getTimestampWithinRange(1.5) },
      QC: { progress: 75, operator: 'John Doe', lastUpdated: getTimestampWithinRange(0.5) },
      INDEX: { progress: 0, operator: null, lastUpdated: null },
      REPREP: { progress: 0, operator: null, lastUpdated: null }
    }
  },
  {
    id: 2,
    clientName: 'TechCorp',
    projectName: 'Q1 Documentation',
    jobId: 'C0002P001B00001',
    operator: 'Jane Smith',
    currentStep: 'SCAN',
    status: 'Urgent',
    steps: {
      PREP: { progress: 100, operator: 'Jane Smith', lastUpdated: getTimestampWithinRange(1) },
      SCAN: { progress: 50, operator: 'Jane Smith', lastUpdated: getTimestampWithinRange(0.2) },
      QC: { progress: 0, operator: null, lastUpdated: null },
      INDEX: { progress: 0, operator: null, lastUpdated: null },
      REPREP: { progress: 0, operator: null, lastUpdated: null }
    }
  },
  {
    id: 3,
    clientName: 'Healthcare Plus',
    projectName: 'Patient Records',
    jobId: 'C0003P001B00001',
    operator: null,
    currentStep: 'PREP',
    status: 'On Hold',
    holdReason: 'Waiting for client confirmation',
    steps: {
      PREP: { progress: 25, operator: 'Tom Wilson', lastUpdated: getTimestampWithinRange(4) },
      SCAN: { progress: 0, operator: null, lastUpdated: null },
      QC: { progress: 0, operator: null, lastUpdated: null },
      INDEX: { progress: 0, operator: null, lastUpdated: null },
      REPREP: { progress: 0, operator: null, lastUpdated: null }
    }
  },
  {
    id: 4,
    clientName: 'Global Finance',
    projectName: 'Transaction Records',
    jobId: 'C0003P002B00008',
    operator: 'Mike Johnson',
    currentStep: 'INDEX',
    status: 'In Progress',
    steps: {
      PREP: { progress: 100, operator: 'Sarah Wilson', lastUpdated: getTimestampWithinRange(2.8) },
      SCAN: { progress: 100, operator: 'Lisa Anderson', lastUpdated: getTimestampWithinRange(2.2) },
      QC: { progress: 100, operator: 'John Doe', lastUpdated: getTimestampWithinRange(1.5) },
      INDEX: { progress: 90, operator: 'Mike Johnson', lastUpdated: getTimestampWithinRange(0.3) },
      REPREP: { progress: 0, operator: null, lastUpdated: null }
    }
  },
  {
    id: 5,
    clientName: 'City Government',
    projectName: 'Building Permits',
    jobId: 'C0005P002B00003',
    operator: 'Alex Brown',
    currentStep: 'REPREP',
    status: 'In Progress',
    steps: {
      PREP: { progress: 100, operator: 'Emily Davis', lastUpdated: getTimestampWithinRange(2.9) },
      SCAN: { progress: 100, operator: 'Mike Johnson', lastUpdated: getTimestampWithinRange(2.3) },
      QC: { progress: 100, operator: 'John Doe', lastUpdated: getTimestampWithinRange(1.8) },
      INDEX: { progress: 100, operator: 'Rachel Green', lastUpdated: getTimestampWithinRange(1.2) },
      REPREP: { progress: 60, operator: 'Alex Brown', lastUpdated: getTimestampWithinRange(0.4) }
    }
  },
  {
    id: 6,
    clientName: 'Education First',
    projectName: 'Student Records',
    jobId: 'C0006P001B00007',
    operator: 'Emily Davis',
    currentStep: 'PREP',
    status: 'In Progress',
    steps: {
      PREP: { progress: 15, operator: 'Emily Davis', lastUpdated: getTimestampWithinRange(0.1) },
      SCAN: { progress: 0, operator: null, lastUpdated: null },
      QC: { progress: 0, operator: null, lastUpdated: null },
      INDEX: { progress: 0, operator: null, lastUpdated: null },
      REPREP: { progress: 0, operator: null, lastUpdated: null }
    }
  },
  {
    id: 7,
    clientName: 'Legal Corp LLC',
    projectName: 'Case Files 2024',
    jobId: 'C0007P002B00004',
    operator: 'Chris Martin',
    currentStep: 'REPREP',
    status: 'In Progress',
    steps: {
      PREP: { progress: 100, operator: 'Sarah Wilson', lastUpdated: getTimestampWithinRange(2.8) },
      SCAN: { progress: 100, operator: 'Mike Johnson', lastUpdated: getTimestampWithinRange(2.1) },
      QC: { progress: 100, operator: 'John Doe', lastUpdated: getTimestampWithinRange(1.6) },
      INDEX: { progress: 100, operator: 'Rachel Green', lastUpdated: getTimestampWithinRange(0.9) },
      REPREP: { progress: 100, operator: 'Chris Martin', lastUpdated: getTimestampWithinRange(0.2) }
    }
  }
] 