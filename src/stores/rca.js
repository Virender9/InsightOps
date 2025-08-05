import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useRCAStore = defineStore('rca', () => {
  const rcaFlows = ref([])
  const activeRCA = ref(null)
  const loading = ref(false)
  const error = ref(null)
  let progressInterval = null

  // API configuration
  const API_BASE_URL = 'http://localhost:4000' // Mock API
  // TODO: Replace with real ML backend API
  // const ML_API_URL = 'https://ml-backend.example.com'
  // const RCA_WEBSOCKET_URL = 'wss://ml-backend.example.com/rca'

  // Computed properties
  const completedRCAFlows = computed(() => 
    rcaFlows.value.filter(rca => rca.status === 'completed')
  )

  const inProgressRCAFlows = computed(() => 
    rcaFlows.value.filter(rca => rca.status === 'in_progress')
  )

  const rcaSuccess = computed(() => {
    const total = completedRCAFlows.value.length
    if (total === 0) return 0
    const successful = completedRCAFlows.value.filter(rca => rca.confidence > 0.7).length
    return (successful / total) * 100
  })

  const averageConfidence = computed(() => {
    const completed = completedRCAFlows.value
    if (completed.length === 0) return 0
    const sum = completed.reduce((acc, rca) => acc + rca.confidence, 0)
    return (sum / completed.length)
  })

  // Additional getters for AIOperationalIntelligence component
  const getTotalRCAReports = () => {
    return completedRCAFlows.value.length
  }

  const getPendingRCACount = () => {
    return inProgressRCAFlows.value.length
  }

  const generatePendingRCA = async () => {
    // Mock function for now - would trigger RCA generation in real implementation
    console.log('Generating pending RCA reports...')
    return Promise.resolve()
  }

  // Actions
  const fetchRCAFlows = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Using mock API for now
      const response = await axios.get(`${API_BASE_URL}/rcaFlows`)
      rcaFlows.value = response.data
      
      /* TODO: Integrate with ML backend API
      const response = await axios.get(`${ML_API_URL}/api/v1/rca/flows`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_ML_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      rcaFlows.value = response.data.flows.map(normalizeRCAFlow)
      */
      
    } catch (err) {
      error.value = 'Failed to fetch RCA flows: ' + err.message
      console.error('Error fetching RCA flows:', err)
    } finally {
      loading.value = false
    }
  }

  /* TODO: Uncomment when ML backend is available
  const normalizeRCAFlow = (flow) => {
    return {
      id: flow.id || flow.flowId,
      incidentId: flow.incidentId || flow.alertId,
      title: flow.title || flow.name,
      status: flow.status || 'in_progress',
      confidence: flow.confidence || flow.confidenceScore || 0,
      rootCause: flow.rootCause || flow.conclusion,
      timeline: flow.timeline || flow.events || [],
      correlatedEvents: flow.correlatedEvents || flow.related || [],
      recommendations: flow.recommendations || flow.actions || [],
      createdAt: flow.createdAt || flow.startTime,
      completedAt: flow.completedAt || flow.endTime,
      metadata: flow.metadata || {}
    }
  }
  */

  const createNewRCA = async (incidentId = null, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const rcaData = {
        incidentId,
        title: options.title || `RCA Analysis - ${new Date().toISOString()}`,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        ...options
      }
      
      // Mock API call
      const response = await axios.post(`${API_BASE_URL}/rcaFlows`, rcaData)
      const newRCA = response.data
      rcaFlows.value.push(newRCA)
      activeRCA.value = newRCA
      
      /* TODO: Integrate with ML backend
      const response = await axios.post(`${ML_API_URL}/api/v1/rca/start`, {
        incident_id: incidentId,
        analysis_type: options.analysisType || 'full',
        priority: options.priority || 'normal',
        include_predictions: true,
        correlation_window: options.timeWindow || '1h'
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_ML_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      const newRCA = normalizeRCAFlow(response.data)
      rcaFlows.value.push(newRCA)
      activeRCA.value = newRCA
      
      // Start monitoring RCA progress
      monitorRCAProgress(newRCA.id)
      */
      
      return newRCA
    } catch (err) {
      error.value = 'Failed to create RCA: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshRCA = async (rcaId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rcaFlows/${rcaId}`)
      const updatedRCA = response.data
      
      const index = rcaFlows.value.findIndex(rca => rca.id === rcaId)
      if (index !== -1) {
        rcaFlows.value[index] = updatedRCA
      }
      
      /* TODO: Real API integration
      const response = await axios.get(`${ML_API_URL}/api/v1/rca/flows/${rcaId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_ML_API_KEY}`
        }
      })
      
      const updatedRCA = normalizeRCAFlow(response.data)
      const index = rcaFlows.value.findIndex(rca => rca.id === rcaId)
      if (index !== -1) {
        rcaFlows.value[index] = updatedRCA
      }
      */
      
      return updatedRCA
    } catch (err) {
      console.error(`Failed to refresh RCA ${rcaId}:`, err)
      throw err
    }
  }

  const stopRCA = async (rcaId) => {
    try {
      await axios.patch(`${API_BASE_URL}/rcaFlows/${rcaId}`, { 
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      })
      
      const index = rcaFlows.value.findIndex(rca => rca.id === rcaId)
      if (index !== -1) {
        rcaFlows.value[index].status = 'cancelled'
      }
      
      /* TODO: Real API integration
      await axios.post(`${ML_API_URL}/api/v1/rca/flows/${rcaId}/stop`, {}, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_ML_API_KEY}`
        }
      })
      */
      
    } catch (err) {
      console.error(`Failed to stop RCA ${rcaId}:`, err)
      throw err
    }
  }

  const deleteRCA = async (rcaId) => {
    try {
      await axios.delete(`${API_BASE_URL}/rcaFlows/${rcaId}`)
      rcaFlows.value = rcaFlows.value.filter(rca => rca.id !== rcaId)
      
      if (activeRCA.value?.id === rcaId) {
        activeRCA.value = null
      }
      
    } catch (err) {
      error.value = 'Failed to delete RCA: ' + err.message
      throw err
    }
  }

  // ML-based anomaly correlation
  const correlateAnomalies = async (anomalies, timeWindow = '1h') => {
    try {
      /* TODO: Implement with ML backend
      const response = await axios.post(`${ML_API_URL}/api/v1/ml/correlate`, {
        anomalies,
        time_window: timeWindow,
        correlation_threshold: 0.7,
        include_causal_chains: true
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_ML_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data.correlations
      */
      
      // Mock correlation logic for development
      return generateMockCorrelations(anomalies)
    } catch (err) {
      console.error('Failed to correlate anomalies:', err)
      return []
    }
  }

  const generateMockCorrelations = (anomalies) => {
    // Simple mock correlation logic
    const correlations = []
    
    anomalies.forEach((anomaly, index) => {
      if (index > 0) {
        const previousAnomaly = anomalies[index - 1]
        const timeDiff = new Date(anomaly.timestamp) - new Date(previousAnomaly.timestamp)
        
        if (timeDiff < 5 * 60 * 1000) { // Within 5 minutes
          correlations.push({
            id: `corr_${index}`,
            anomalies: [previousAnomaly.id, anomaly.id],
            confidence: 0.75 + Math.random() * 0.2,
            type: 'temporal',
            causalChain: [previousAnomaly.source, anomaly.source]
          })
        }
      }
    })
    
    return correlations
  }

  // Predictive RCA
  const predictRootCause = async (incidentData) => {
    try {
      /* TODO: Implement ML prediction
      const response = await axios.post(`${ML_API_URL}/api/v1/ml/predict`, {
        incident: incidentData,
        model_version: 'latest',
        confidence_threshold: 0.6,
        max_predictions: 5
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_ML_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data.predictions
      */
      
      // Mock prediction for development
      return generateMockPredictions(incidentData)
    } catch (err) {
      console.error('Failed to predict root cause:', err)
      return []
    }
  }

  const generateMockPredictions = (incidentData) => {
    const commonCauses = [
      'Memory leak in application',
      'Database connection pool exhaustion',
      'Network configuration error',
      'Disk space shortage',
      'CPU throttling due to thermal limits',
      'Service dependency failure'
    ]
    
    return commonCauses.slice(0, 3).map((cause, index) => ({
      rootCause: cause,
      confidence: 0.9 - (index * 0.15),
      reasoning: `Pattern matches historical incidents with similar characteristics`,
      evidence: [`metric_anomaly_${index + 1}`, `log_pattern_${index + 1}`],
      timeline: generateMockTimeline(cause)
    }))
  }

  const generateMockTimeline = (rootCause) => {
    const baseTime = new Date()
    return [
      {
        timestamp: new Date(baseTime.getTime() - 30 * 60 * 1000).toISOString(),
        event: 'Initial trigger event',
        impact: 'low'
      },
      {
        timestamp: new Date(baseTime.getTime() - 15 * 60 * 1000).toISOString(),
        event: 'Cascading effect begins',
        impact: 'medium'
      },
      {
        timestamp: baseTime.toISOString(),
        event: rootCause,
        impact: 'high'
      }
    ]
  }

  // Real-time RCA monitoring
  const monitorRCAProgress = (rcaId) => {
    /* TODO: Implement WebSocket monitoring
    const ws = new WebSocket(`${RCA_WEBSOCKET_URL}/${rcaId}`)
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      const index = rcaFlows.value.findIndex(rca => rca.id === rcaId)
      
      if (index !== -1) {
        rcaFlows.value[index] = { ...rcaFlows.value[index], ...update }
      }
    }
    
    ws.onerror = (error) => {
      console.error('RCA monitoring error:', error)
    }
    
    return ws
    */
    
    // Clean up existing interval
    if (progressInterval) {
      clearInterval(progressInterval)
    }
    
    // Mock progress updates for development
    progressInterval = setInterval(() => {
      const index = rcaFlows.value.findIndex(rca => rca.id === rcaId)
      if (index !== -1 && rcaFlows.value[index].status === 'in_progress') {
        rcaFlows.value[index].confidence = Math.min(0.95, rcaFlows.value[index].confidence + 0.05)
      }
    }, 5000)
    
    return progressInterval
  }
  
  const stopRCAProgress = () => {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }
  
  // Cleanup method for component unmount
  const destroy = () => {
    stopRCAProgress()
  }

  // Export RCA report
  const exportRCAReport = (rcaId, format = 'json') => {
    const rca = rcaFlows.value.find(r => r.id === rcaId)
    if (!rca) throw new Error('RCA not found')
    
    const report = {
      id: rca.id,
      title: rca.title,
      incident_id: rca.incidentId,
      analysis: {
        status: rca.status,
        confidence: rca.confidence,
        root_cause: rca.rootCause,
        timeline: rca.timeline,
        correlated_events: rca.correlatedEvents,
        recommendations: rca.recommendations
      },
      metadata: {
        created_at: rca.createdAt,
        completed_at: rca.completedAt,
        duration: rca.completedAt ? 
          new Date(rca.completedAt) - new Date(rca.createdAt) : null,
        exported_at: new Date().toISOString()
      }
    }
    
    if (format === 'markdown') {
      return generateMarkdownReport(report)
    }
    
    return JSON.stringify(report, null, 2)
  }

  const generateMarkdownReport = (report) => {
    return `# Root Cause Analysis Report

## Overview
- **ID:** ${report.id}
- **Title:** ${report.title}
- **Status:** ${report.analysis.status}
- **Confidence:** ${Math.round(report.analysis.confidence * 100)}%

## Root Cause
${report.analysis.root_cause}

## Timeline
${report.analysis.timeline.map(event => 
  `- **${new Date(event.timestamp).toLocaleString()}**: ${event.event} (${event.impact} impact)`
).join('\n')}

## Correlated Events
${report.analysis.correlated_events.map(event => `- ${event}`).join('\n')}

## Recommendations
${report.analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

---
*Report generated on ${new Date(report.metadata.exported_at).toLocaleString()}*
`
  }

  return {
    // State
    rcaFlows,
    activeRCA,
    loading,
    error,
    
    // Computed
    completedRCAFlows,
    inProgressRCAFlows,
    rcaSuccess,
    averageConfidence,
    
    // Getters
    getTotalRCAReports,
    getPendingRCACount,
    
    // Actions
    generatePendingRCA,
    fetchRCAFlows,
    createNewRCA,
    refreshRCA,
    stopRCA,
    deleteRCA,
    correlateAnomalies,
    predictRootCause,
    monitorRCAProgress,
    stopRCAProgress,
    destroy,
    exportRCAReport
  }
})
