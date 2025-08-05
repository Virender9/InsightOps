import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMetricsStore = defineStore('metrics', () => {
  const metrics = ref([])
  const realtimeMetrics = ref(null)
  const loading = ref(false)
  const error = ref(null)
  let realtimeInterval = null

  // API configuration
  const API_BASE_URL = 'http://localhost:4000' // Mock API
  // TODO: Replace with real API endpoints
  // const METRICS_API_URL = 'https://metrics-api.example.com'

  // Computed properties
  const latestMetrics = computed(() => {
    if (metrics.value.length === 0) return null
    return metrics.value[metrics.value.length - 1]
  })

  const averageCpuUsage = computed(() => {
    if (metrics.value.length === 0) return 0
    const sum = metrics.value.reduce((acc, m) => acc + m.cpuUsage, 0)
    return Math.round((sum / metrics.value.length) * 10) / 10
  })

  const averageMemoryUsage = computed(() => {
    if (metrics.value.length === 0) return 0
    const sum = metrics.value.reduce((acc, m) => acc + m.memoryUsage, 0)
    return Math.round((sum / metrics.value.length) * 10) / 10
  })

  const averageDiskIO = computed(() => {
    if (metrics.value.length === 0) return 0
    const sum = metrics.value.reduce((acc, m) => acc + m.diskIO, 0)
    return Math.round((sum / metrics.value.length) * 10) / 10
  })

  const averageLatency = computed(() => {
    if (metrics.value.length === 0) return 0
    const sum = metrics.value.reduce((acc, m) => acc + m.latency, 0)
    return Math.round(sum / metrics.value.length)
  })

  const systemHealth = computed(() => {
    const latest = latestMetrics.value
    if (!latest) return 'unknown'
    
    const cpuHealth = latest.cpuUsage < 70 ? 'good' : latest.cpuUsage < 85 ? 'warning' : 'critical'
    const memoryHealth = latest.memoryUsage < 80 ? 'good' : latest.memoryUsage < 90 ? 'warning' : 'critical'
    const latencyHealth = latest.latency < 200 ? 'good' : latest.latency < 500 ? 'warning' : 'critical'
    
    if ([cpuHealth, memoryHealth, latencyHealth].includes('critical')) return 'critical'
    if ([cpuHealth, memoryHealth, latencyHealth].includes('warning')) return 'warning'
    return 'good'
  })

  // Actions
  const fetchMetrics = async (timeRange = '1h') => {
    loading.value = true
    error.value = null
    
    try {
      // Using mock API for now
      const response = await axios.get(`${API_BASE_URL}/metrics`, {
        params: { timeRange }
      })
      metrics.value = response.data
      
      /* TODO: Integrate with real metrics API
      const response = await axios.get(`${METRICS_API_URL}/api/v1/metrics`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_METRICS_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          timeRange,
          metrics: ['cpu', 'memory', 'disk', 'network'],
          granularity: '1m'
        }
      })
      
      metrics.value = response.data.metrics.map(normalizeMetric)
      */
      
    } catch (err) {
      error.value = 'Failed to fetch metrics: ' + err.message
      console.error('Error fetching metrics:', err)
    } finally {
      loading.value = false
    }
  }

  /* TODO: Uncomment when real API is available
  const normalizeMetric = (metric) => {
    return {
      id: metric.id || `${metric.timestamp}_${metric.source}`,
      cpuUsage: metric.cpu?.usage || metric.cpuUsage,
      memoryUsage: metric.memory?.usage || metric.memoryUsage,
      diskIO: metric.disk?.io || metric.diskIO,
      latency: metric.network?.latency || metric.latency,
      timestamp: metric.timestamp || metric.time,
      server: metric.source || metric.hostname
    }
  }
  */

  // Real-time metrics streaming
  const startRealtimeMetrics = () => {
    // Clean up existing interval
    if (realtimeInterval) {
      clearInterval(realtimeInterval)
    }
    
    /* TODO: Uncomment when real API is available
    const eventSource = new EventSource(`${API_BASE_URL}/metrics/stream`)
    
    eventSource.onmessage = (event) => {
      const metric = JSON.parse(event.data)
      realtimeMetrics.value = metric
      metrics.value.push(metric)
      
      // Keep only last 100 points for performance
      if (metrics.value.length > 100) {
        metrics.value = metrics.value.slice(-100)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('Metrics stream error:', error)
      setTimeout(startRealtimeMetrics, 5000) // Retry after 5 seconds
    }
    
    return eventSource
    */
    
    // Mock real-time data for development
    realtimeInterval = setInterval(() => {
      const mockMetric = generateMockMetric()
      realtimeMetrics.value = mockMetric
      metrics.value.push(mockMetric)
      
      // Keep only last 100 points
      if (metrics.value.length > 100) {
        metrics.value = metrics.value.slice(-100)
      }
    }, 10000) // Update every 10 seconds
    
    return realtimeInterval
  }
  
  const stopRealtimeMetrics = () => {
    if (realtimeInterval) {
      clearInterval(realtimeInterval)
      realtimeInterval = null
    }
  }
  
  // Cleanup method for component unmount
  const destroy = () => {
    stopRealtimeMetrics()
  }

  const generateMockMetric = () => {
    const latest = latestMetrics.value || { cpuUsage: 25, memoryUsage: 50, diskIO: 15, latency: 120 }
    
    return {
      id: `mock_${Date.now()}`,
      cpuUsage: Math.max(0, Math.min(100, latest.cpuUsage + (Math.random() - 0.5) * 10)),
      memoryUsage: Math.max(0, Math.min(100, latest.memoryUsage + (Math.random() - 0.5) * 8)),
      diskIO: Math.max(0, Math.min(100, latest.diskIO + (Math.random() - 0.5) * 5)),
      latency: Math.max(0, latest.latency + (Math.random() - 0.5) * 50),
      timestamp: new Date().toISOString(),
      server: 'mock-server'
    }
  }

  // Server-specific metrics
  const fetchServerMetrics = async (serverId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/metrics`, {
        params: { server: serverId }
      })
      return response.data
      
      /* TODO: Real API integration
      const response = await axios.get(`${METRICS_API_URL}/api/v1/servers/${serverId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_METRICS_API_KEY}`
        }
      })
      return response.data.metrics.map(normalizeMetric)
      */
      
    } catch (err) {
      console.error(`Error fetching metrics for server ${serverId}:`, err)
      return []
    }
  }

  // Historical metrics analysis
  const getMetricsTrend = (metric, timeRange = '24h') => {
    if (metrics.value.length < 2) return 'stable'
    
    const recent = metrics.value.slice(-10) // Last 10 data points
    const values = recent.map(m => m[metric]).filter(v => v !== undefined)
    
    if (values.length < 2) return 'stable'
    
    const first = values[0]
    const last = values[values.length - 1]
    const change = ((last - first) / first) * 100
    
    if (Math.abs(change) < 5) return 'stable'
    return change > 0 ? 'increasing' : 'decreasing'
  }

  // Performance analytics
  const getPerformanceInsights = () => {
    if (metrics.value.length === 0) return []
    
    const insights = []
    const latest = latestMetrics.value
    const avg = {
      cpu: averageCpuUsage.value,
      memory: averageMemoryUsage.value,
      latency: averageLatency.value
    }
    
    // CPU insights
    if (latest.cpuUsage > avg.cpu * 1.5) {
      insights.push({
        type: 'warning',
        metric: 'CPU',
        message: `CPU usage is ${Math.round(((latest.cpuUsage / avg.cpu) - 1) * 100)}% above average`,
        recommendation: 'Check for resource-intensive processes'
      })
    }
    
    // Memory insights  
    if (latest.memoryUsage > avg.memory * 1.3) {
      insights.push({
        type: 'warning',
        metric: 'Memory',
        message: `Memory usage is ${Math.round(((latest.memoryUsage / avg.memory) - 1) * 100)}% above average`,
        recommendation: 'Monitor for memory leaks'
      })
    }
    
    // Latency insights
    if (latest.latency > avg.latency * 2) {
      insights.push({
        type: 'critical',
        metric: 'Latency',
        message: `Network latency is significantly elevated`,
        recommendation: 'Check network connectivity and server load'
      })
    }
    
    return insights
  }

  // Threshold monitoring
  const checkThresholds = (thresholds) => {
    const alerts = []
    const latest = latestMetrics.value
    
    if (!latest) return alerts
    
    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = latest[metric]
      if (value > threshold.critical) {
        alerts.push({
          metric,
          level: 'critical',
          value,
          threshold: threshold.critical,
          message: `${metric} has exceeded critical threshold`
        })
      } else if (value > threshold.warning) {
        alerts.push({
          metric,
          level: 'warning', 
          value,
          threshold: threshold.warning,
          message: `${metric} has exceeded warning threshold`
        })
      }
    })
    
    return alerts
  }

  // Export metrics data
  const exportMetrics = (format = 'json', timeRange = '24h') => {
    const data = {
      exported_at: new Date().toISOString(),
      time_range: timeRange,
      metrics: metrics.value,
      summary: {
        averageCpuUsage: averageCpuUsage.value,
        averageMemoryUsage: averageMemoryUsage.value,
        averageDiskIO: averageDiskIO.value,
        averageLatency: averageLatency.value,
        systemHealth: systemHealth.value
      }
    }
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = 'timestamp,cpuUsage,memoryUsage,diskIO,latency,server\n'
      const csvData = metrics.value.map(m => 
        `${m.timestamp},${m.cpuUsage},${m.memoryUsage},${m.diskIO},${m.latency},${m.server || ''}`
      ).join('\n')
      
      return csvHeaders + csvData
    }
    
    return JSON.stringify(data, null, 2)
  }

  // Additional computed properties for simplified dashboard
  const overallHealth = computed(() => {
    const latest = latestMetrics.value
    if (!latest) return 95 // Default healthy value
    
    // Simple health calculation based on key metrics
    const cpuScore = Math.max(0, 100 - latest.cpuUsage)
    const memoryScore = Math.max(0, 100 - latest.memoryUsage) 
    const diskScore = Math.max(0, 100 - latest.diskIO)
    const latencyScore = Math.min(100, Math.max(0, 100 - (latest.latency / 10)))
    
    return Math.round((cpuScore + memoryScore + diskScore + latencyScore) / 4)
  })

  const cpuUsage = computed(() => {
    const latest = latestMetrics.value
    return latest ? latest.cpuUsage : 45 // Mock default
  })

  const memoryUsage = computed(() => {
    const latest = latestMetrics.value
    return latest ? latest.memoryUsage : 62 // Mock default
  })

  const diskUsage = computed(() => {
    const latest = latestMetrics.value
    return latest ? latest.diskIO : 38 // Mock default
  })

  const networkIO = computed(() => {
    const latest = latestMetrics.value
    return latest ? latest.networkIO || 25 : 25 // Mock default
  })

  const healthTrend = computed(() => {
    if (metrics.value.length < 2) return 0
    const current = overallHealth.value
    const previous = metrics.value.length > 1 ? 95 : current // Simplified
    return Math.round(((current - previous) / previous) * 100)
  })

  const latencyTrend = computed(() => {
    if (metrics.value.length < 2) return 0
    const current = averageLatency.value
    const previous = current * 1.1 // Simplified trend calculation
    return Math.round(((current - previous) / previous) * 100)
  })

  // Additional getters for AIOperationalIntelligence component
  const getAllMetrics = () => {
    return metrics.value
  }

  const getOverallHealthScore = () => {
    return overallHealth.value
  }

  return {
    // State
    metrics,
    realtimeMetrics,
    loading,
    error,
    
    // Computed
    latestMetrics,
    averageCpuUsage,
    averageMemoryUsage,
    averageDiskIO,
    averageLatency,
    systemHealth,
    
    // Dashboard specific properties
    overallHealth,
    cpuUsage,
    memoryUsage,
    diskUsage,
    networkIO,
    healthTrend,
    latencyTrend,
    
    // Getters
    getAllMetrics,
    getOverallHealthScore,
    
    // Actions
    fetchMetrics,
    startRealtimeMetrics,
    stopRealtimeMetrics,
    destroy,
    fetchServerMetrics,
    getMetricsTrend,
    getPerformanceInsights,
    checkThresholds,
    exportMetrics
  }
})
