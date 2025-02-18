import { defineStore } from 'pinia'
import type { Job } from '../types'
import { mockJobs } from './mockData'

export const useJobStore = defineStore('jobs', {
  state: () => ({
    jobs: mockJobs as Job[],
    recentlyCompleted: null as number | null
  }),
  
  actions: {
    setJobs(jobs: Job[]) {
      this.jobs = jobs
    },
    
    completeJob(jobId: number) {
      const job = this.jobs.find(j => j.id === jobId)
      if (job) {
        // Update all steps to 100% complete
        Object.keys(job.steps).forEach(step => {
          job.steps[step].progress = 100
          job.steps[step].lastUpdated = new Date().toISOString()
        })
        job.status = 'Completed'
        job.currentStep = 'Completed'
        this.recentlyCompleted = jobId // Track for animation
        
        // Reset after animation duration
        setTimeout(() => {
          this.recentlyCompleted = null
        }, 2000)
      }
    }
  },

  getters: {
    completedJobs: (state) => {
      return state.jobs.filter(job => job.status === 'Completed')
    },
    activeJobs: (state) => {
      return state.jobs.filter(job => job.status !== 'Completed')
    }
  }
}) 