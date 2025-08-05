import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAlertsStore = defineStore('alerts', () => {
  const alerts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // API configuration
  const API_BASE_URL = 'http://localhost:4000' // Mock API
  // TODO: Replace with real API endpoints when ready
  // const HELIX_API_URL = 'https://helix-console-api.example.com'
  // const SWIFT_API_URL = 'https://swift-console-api.example.com'

  // Computed properties
  const activeAlerts = computed(() => 
    alerts.value.filter(alert => alert.status === 'active')
  )

  const criticalAlerts = computed(() => 
    alerts.value.filter(alert => alert.severity === 'critical' && alert.status === 'active')
  )

  const alertsByType = computed(() => {
    const grouped = {}
    alerts.value.forEach(alert => {
      if (!grouped[alert.type]) {
        grouped[alert.type] = []
      }
      grouped[alert.type].push(alert)
    })
    return grouped
  })

  const alertsSummary = computed(() => {
    const summary = {
      total: alerts.value.length,
      active: 0,
      critical: 0,
      warning: 0,
      resolved: 0
    }
    
    alerts.value.forEach(alert => {
      if (alert.status === 'active') {
        summary.active++
        if (alert.severity === 'critical') summary.critical++
        if (alert.severity === 'warning') summary.warning++
      } else if (alert.status === 'resolved') {
        summary.resolved++
      }
    })
    
    return summary
  })

  // Actions
  const fetchAlerts = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Using mock API for now
      const response = await axios.get(`${API_BASE_URL}/alerts`)
      alerts.value = response.data
      
      /* TODO: Integrate with real APIs when ready
      // Helix Console API integration
      const helixAlerts = await fetchHelixAlerts()
      
      // Swift Console API integration  
      const swiftAlerts = await fetchSwiftAlerts()
      
      // Combine and normalize alerts
      alerts.value = [...helixAlerts, ...swiftAlerts].map(normalizeAlert)
      */
      
    } catch (err) {
      error.value = 'Failed to fetch alerts: ' + err.message
      console.error('Error fetching alerts:', err)
    } finally {
      loading.value = false
    }
  }

  /* TODO: Uncomment and implement when real APIs are available
  const fetchHelixAlerts = async () => {
    try {
      const response = await axios.get(`${HELIX_API_URL}/api/v1/alerts`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_HELIX_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          status: 'active',
          limit: 100
        }
      })
      
      return response.data.alerts || []
    } catch (err) {
      console.error('Helix API error:', err)
      return []
    }
  }

  const fetchSwiftAlerts = async () => {
    try {
      const response = await axios.get(`${SWIFT_API_URL}/api/alerts`, {
        headers: {
          'X-API-Key': process.env.VUE_APP_SWIFT_API_KEY,
          'Content-Type': 'application/json'
        },
        params: {
          type: ['temperature', 'server', 'network'],
          include_resolved: false
        }
      })
      
      return response.data || []
    } catch (err) {
      console.error('Swift API error:', err)
      return []
    }
  }

  const normalizeAlert = (alert) => {
    // Normalize different API response formats
    return {
      id: alert.id || alert.alertId,
      type: alert.type || alert.category?.toLowerCase(),
      severity: alert.severity || alert.priority?.toLowerCase(),
      source: alert.source || alert.hostname || alert.device,
      message: alert.message || alert.description,
      value: alert.value || alert.currentValue,
      threshold: alert.threshold || alert.thresholdValue,
      timestamp: alert.timestamp || alert.createdAt || alert.time,
      status: alert.status || (alert.resolved ? 'resolved' : 'active'),
      location: alert.location || alert.datacenter,
      metadata: alert.metadata || alert.details
    }
  }
  */

  const createAlert = async (alertData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/alerts`, alertData)
      alerts.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create alert: ' + err.message
      throw err
    }
  }

  const updateAlert = async (alertId, updates) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/alerts/${alertId}`, updates)
      const index = alerts.value.findIndex(a => a.id === alertId)
      if (index !== -1) {
        alerts.value[index] = { ...alerts.value[index], ...response.data }
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update alert: ' + err.message
      throw err
    }
  }

  const resolveAlert = async (alertId) => {
    return updateAlert(alertId, { 
      status: 'resolved', 
      resolvedAt: new Date().toISOString() 
    })
  }

  const acknowledgeAlert = async (alertId) => {
    return updateAlert(alertId, { 
      acknowledged: true, 
      acknowledgedAt: new Date().toISOString() 
    })
  }

  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(`${API_BASE_URL}/alerts/${alertId}`)
      alerts.value = alerts.value.filter(a => a.id !== alertId)
    } catch (err) {
      error.value = 'Failed to delete alert: ' + err.message
      throw err
    }
  }

  // Real-time alert monitoring
  const startRealTimeMonitoring = () => {
    // TODO: Implement WebSocket connection for real-time alerts
    /*
    const ws = new WebSocket(WS_ALERTS_URL)
    
    ws.onmessage = (event) => {
      const alertUpdate = JSON.parse(event.data)
      
      if (alertUpdate.type === 'new_alert') {
        alerts.value.push(alertUpdate.data)
      } else if (alertUpdate.type === 'alert_updated') {
        const index = alerts.value.findIndex(a => a.id === alertUpdate.data.id)
        if (index !== -1) {
          alerts.value[index] = alertUpdate.data
        }
      }
    }
    
    return ws
    */
  }

  // Alert filtering and search
  const filterAlerts = (filters) => {
    let filtered = [...alerts.value]
    
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(alert => alert.type === filters.type)
    }
    
    if (filters.severity) {
      filtered = filtered.filter(alert => filters.severity.includes(alert.severity))
    }
    
    if (filters.status) {
      filtered = filtered.filter(alert => filters.status.includes(alert.status))
    }
    
    if (filters.source) {
      filtered = filtered.filter(alert => 
        alert.source.toLowerCase().includes(filters.source.toLowerCase())
      )
    }
    
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      filtered = filtered.filter(alert => {
        const alertDate = new Date(alert.timestamp)
        return alertDate >= start && alertDate <= end
      })
    }
    
    return filtered
  }

  // Alert metrics for dashboards
  const getAlertMetrics = (timeRange = '24h') => {
    const now = new Date()
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }
    
    const cutoff = new Date(now.getTime() - timeRangeMs[timeRange])
    const recentAlerts = alerts.value.filter(alert => 
      new Date(alert.timestamp) >= cutoff
    )
    
    return {
      total: recentAlerts.length,
      critical: recentAlerts.filter(a => a.severity === 'critical').length,
      warning: recentAlerts.filter(a => a.severity === 'warning').length,
      byType: recentAlerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1
        return acc
      }, {}),
      resolutionRate: recentAlerts.filter(a => a.status === 'resolved').length / recentAlerts.length
    }
  }

  // Additional computed properties for simplified dashboard
  const recentAlerts = computed(() => 
    alerts.value
      .filter(alert => alert.status === 'active')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
  )

  const criticalCount = computed(() => 
    alerts.value.filter(alert => alert.severity === 'Critical' && alert.status === 'active').length
  )

  const trend = computed(() => {
    // Simple trend calculation - could be enhanced with historical data
    const recent = alerts.value.filter(alert => {
      const alertTime = new Date(alert.timestamp)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return alertTime > oneDayAgo
    }).length
    
    const previous = alerts.value.filter(alert => {
      const alertTime = new Date(alert.timestamp)
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return alertTime > twoDaysAgo && alertTime <= oneDayAgo
    }).length
    
    if (previous === 0) return recent > 0 ? 100 : 0
    return Math.round(((recent - previous) / previous) * 100)
  })

  // Additional getters for AIOperationalIntelligence component
  const getAllAlerts = () => {
    return alerts.value
  }

  const getCriticalIncidents = () => {
    return alerts.value.filter(alert => 
      alert.severity === 'Critical' || 
      alert.severity === 'critical' ||
      alert.priority === 'Critical' ||
      alert.priority === 'critical'
    )
  }

  return {
    // State
    alerts,
    loading,
    error,
    
    // Computed
    activeAlerts,
    criticalAlerts,
    alertsByType,
    alertsSummary,
    
    // Computed for simplified dashboard
    recentAlerts,
    criticalCount,
    trend,
    
    // Getters
    getAllAlerts,
    getCriticalIncidents,
    
    // Actions
    fetchAlerts,
    createAlert,
    updateAlert,
    resolveAlert,
    acknowledgeAlert,
    deleteAlert,
    filterAlerts,
    getAlertMetrics,
    startRealTimeMonitoring
  }
})
