class RealtimeMonitoringService {
  constructor() {
    this.connections = new Map()
    this.subscriptions = new Map()
    this.reconnectAttempts = new Map()
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.pollingIntervals = new Map()
    
    // API endpoints configuration
    this.endpoints = {
      // Real API endpoints (uncomment when available)
      // HELIX_ALERTS_WS: 'wss://helix-console.example.com/ws/alerts',
      // SWIFT_METRICS_SSE: 'https://swift-console.example.com/sse/metrics',
      // ML_ANALYSIS_WS: 'wss://ml-backend.example.com/ws/analysis',
      
      // Mock endpoints for development
      MOCK_ALERTS_WS: 'ws://localhost:4001/ws/alerts',
      MOCK_METRICS_SSE: 'http://localhost:4000/sse/metrics',
      MOCK_ML_ANALYSIS: 'http://localhost:4000/api/ml/analysis'
    }
  }

  /**
   * Start real-time monitoring for alerts using WebSocket
   */
  startAlertMonitoring(callback, serverFilter = null) {
    const wsUrl = this.endpoints.MOCK_ALERTS_WS // Switch to HELIX_ALERTS_WS in production
    
    try {
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('✅ Alert WebSocket connected')
        this.reconnectAttempts.delete('alerts')
        
        // Send server filter if specified
        if (serverFilter) {
          ws.send(JSON.stringify({
            type: 'filter',
            server: serverFilter
          }))
        }
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Handle different alert types
          switch (data.type) {
            case 'new_alert':
              this.handleNewAlert(data.payload, callback)
              break
            case 'alert_updated':
              this.handleAlertUpdate(data.payload, callback)
              break
            case 'alert_resolved':
              this.handleAlertResolved(data.payload, callback)
              break
            case 'bulk_alerts':
              this.handleBulkAlerts(data.payload, callback)
              break
          }
        } catch (error) {
          console.error('Error processing alert message:', error)
        }
      }
      
      ws.onclose = () => {
        console.log('⚠️ Alert WebSocket disconnected')
        this.attemptReconnect('alerts', () => this.startAlertMonitoring(callback, serverFilter))
      }
      
      ws.onerror = (error) => {
        console.error('Alert WebSocket error:', error)
      }
      
      this.connections.set('alerts', ws)
      return ws
      
    } catch (error) {
      console.error('Failed to start alert monitoring:', error)
      // Fallback to polling
      this.startAlertPolling(callback, serverFilter)
    }
  }

  /**
   * Start real-time metrics monitoring using Server-Sent Events
   */
  startMetricsMonitoring(callback, serverFilter = null) {
    const sseUrl = this.endpoints.MOCK_METRICS_SSE
    
    try {
      const eventSource = new EventSource(`${sseUrl}${serverFilter ? `?server=${serverFilter}` : ''}`)
      
      eventSource.onopen = () => {
        console.log('✅ Metrics SSE connected')
        this.reconnectAttempts.delete('metrics')
      }
      
      eventSource.onmessage = (event) => {
        try {
          const metricsData = JSON.parse(event.data)
          this.handleMetricsUpdate(metricsData, callback)
        } catch (error) {
          console.error('Error processing metrics message:', error)
        }
      }
      
      // Handle specific metric types
      eventSource.addEventListener('cpu_alert', (event) => {
        const data = JSON.parse(event.data)
        callback({ type: 'cpu_threshold_exceeded', data })
      })
      
      eventSource.addEventListener('memory_alert', (event) => {
        const data = JSON.parse(event.data)
        callback({ type: 'memory_threshold_exceeded', data })
      })
      
      eventSource.onerror = () => {
        console.log('⚠️ Metrics SSE disconnected')
        eventSource.close()
        this.attemptReconnect('metrics', () => this.startMetricsMonitoring(callback, serverFilter))
      }
      
      this.connections.set('metrics', eventSource)
      return eventSource
      
    } catch (error) {
      console.error('Failed to start metrics monitoring:', error)
      // Fallback to polling
      this.startMetricsPolling(callback, serverFilter)
    }
  }

  /**
   * Start AI/ML analysis monitoring
   */
  startMLAnalysisMonitoring(callback) {
    // For ML analysis, we'll use a combination of WebSocket and polling
    try {
      const ws = new WebSocket('ws://localhost:4002/ws/ml-analysis') // ML Backend WebSocket
      
      ws.onopen = () => {
        console.log('✅ ML Analysis WebSocket connected')
        this.reconnectAttempts.delete('ml')
      }
      
      ws.onmessage = (event) => {
        try {
          const analysis = JSON.parse(event.data)
          this.handleMLAnalysis(analysis, callback)
        } catch (error) {
          console.error('Error processing ML analysis:', error)
        }
      }
      
      ws.onclose = () => {
        console.log('⚠️ ML Analysis WebSocket disconnected')
        this.attemptReconnect('ml', () => this.startMLAnalysisMonitoring(callback))
      }
      
      this.connections.set('ml', ws)
      return ws
      
    } catch (error) {
      console.error('Failed to start ML analysis monitoring:', error)
      // Fallback to polling for ML analysis
      this.startMLPolling(callback)
    }
  }

  /**
   * Handle new alert with AI analysis
   */
  handleNewAlert(alertData, callback) {
    // Add timestamp and processing metadata
    const processedAlert = {
      ...alertData,
      received_at: new Date().toISOString(),
      requires_ml_analysis: this.shouldAnalyzeAlert(alertData)
    }
    
    callback({
      type: 'new_alert',
      data: processedAlert,
      ai_analysis_pending: processedAlert.requires_ml_analysis
    })
    
    // Trigger ML analysis for critical alerts
    if (processedAlert.requires_ml_analysis) {
      this.requestMLAnalysis(processedAlert)
    }
  }

  /**
   * Handle metrics update with anomaly detection
   */
  handleMetricsUpdate(metricsData, callback) {
    // Add anomaly detection flags
    const processedMetrics = {
      ...metricsData,
      anomaly_detected: this.detectSimpleAnomalies(metricsData),
      timestamp: new Date().toISOString()
    }
    
    callback({
      type: 'metrics_update',
      data: processedMetrics
    })
  }

  /**
   * Handle ML analysis results
   */
  handleMLAnalysis(analysisData, callback) {
    callback({
      type: 'ml_analysis_complete',
      data: {
        ...analysisData,
        confidence_score: analysisData.confidence || 0.85,
        recommendations: this.generateRecommendations(analysisData),
        predicted_impact: this.predictImpact(analysisData)
      }
    })
  }

  /**
   * Simple anomaly detection (can be replaced with more sophisticated ML)
   */
  detectSimpleAnomalies(metrics) {
    const anomalies = []
    
    // CPU anomaly detection
    if (metrics.cpu > 90) {
      anomalies.push({
        type: 'cpu_spike',
        severity: 'high',
        message: `CPU usage at ${metrics.cpu}% - significantly above normal`
      })
    }
    
    // Memory anomaly detection
    if (metrics.memory > 95) {
      anomalies.push({
        type: 'memory_critical',
        severity: 'critical',
        message: `Memory usage at ${metrics.memory}% - critical level reached`
      })
    }
    
    // Network anomaly detection
    if (metrics.network > 80 && metrics.cpu < 30) {
      anomalies.push({
        type: 'network_anomaly',
        severity: 'medium',
        message: 'High network usage with low CPU - possible DDoS or data transfer issue'
      })
    }
    
    return anomalies
  }

  /**
   * Determine if alert requires ML analysis
   */
  shouldAnalyzeAlert(alert) {
    const criticalTypes = ['critical', 'high', 'security', 'performance']
    return criticalTypes.includes(alert.severity?.toLowerCase()) || 
           alert.message?.includes('outage') ||
           alert.message?.includes('failure')
  }

  /**
   * Request ML analysis for an alert
   */
  async requestMLAnalysis(alert) {
    try {
      const response = await fetch(this.endpoints.MOCK_ML_ANALYSIS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alert_id: alert.id,
          alert_data: alert,
          analysis_type: 'comprehensive',
          include_predictions: true
        })
      })
      
      if (!response.ok) {
        throw new Error(`ML analysis request failed: ${response.statusText}`)
      }
      
      const analysisResult = await response.json()
      console.log('ML Analysis requested for alert:', alert.id, analysisResult)
      
    } catch (error) {
      console.error('Failed to request ML analysis:', error)
    }
  }

  /**
   * Generate AI recommendations based on analysis
   */
  generateRecommendations(analysisData) {
    const recommendations = []
    
    if (analysisData.alert_type === 'cpu_spike') {
      recommendations.push({
        action: 'scale_horizontally',
        priority: 'high',
        description: 'Consider adding more server instances to distribute load',
        estimated_time: '5-10 minutes'
      })
    }
    
    if (analysisData.alert_type === 'memory_leak') {
      recommendations.push({
        action: 'restart_service',
        priority: 'medium',
        description: 'Restart affected service to clear memory leak',
        estimated_time: '2-3 minutes'
      })
    }
    
    return recommendations
  }

  /**
   * Predict impact of current issues
   */
  predictImpact(analysisData) {
    // Simple impact prediction (can be enhanced with ML models)
    const impact = {
      severity: analysisData.severity || 'medium',
      affected_users: this.estimateAffectedUsers(analysisData),
      estimated_downtime: this.estimateDowntime(analysisData),
      business_impact: this.estimateBusinessImpact(analysisData)
    }
    
    return impact
  }

  /**
   * Fallback polling for alerts when WebSocket fails
   */
  startAlertPolling(callback, serverFilter) {
    console.log('🔄 Starting alert polling fallback')
    
    const poll = async () => {
      try {
        const url = `http://localhost:4000/api/alerts${serverFilter ? `?server=${serverFilter}` : ''}`
        const response = await fetch(url)
        const alerts = await response.json()
        
        callback({
          type: 'alerts_batch',
          data: alerts,
          source: 'polling'
        })
        
      } catch (error) {
        console.error('Alert polling error:', error)
      }
    }
    
    // Poll every 10 seconds
    const interval = setInterval(poll, 10000)
    this.pollingIntervals.set('alerts', interval)
    
    // Initial poll
    poll()
  }

  /**
   * Fallback polling for metrics
   */
  startMetricsPolling(callback, serverFilter) {
    console.log('🔄 Starting metrics polling fallback')
    
    const poll = async () => {
      try {
        const url = `http://localhost:4000/api/metrics${serverFilter ? `?server=${serverFilter}` : ''}`
        const response = await fetch(url)
        const metrics = await response.json()
        
        this.handleMetricsUpdate(metrics, callback)
        
      } catch (error) {
        console.error('Metrics polling error:', error)
      }
    }
    
    // Poll every 5 seconds for metrics
    const interval = setInterval(poll, 5000)
    this.pollingIntervals.set('metrics', interval)
    
    // Initial poll
    poll()
  }

  /**
   * ML analysis polling fallback
   */
  startMLPolling(callback) {
    console.log('🔄 Starting ML analysis polling fallback')
    
    const poll = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ml/pending-analysis')
        const analyses = await response.json()
        
        analyses.forEach(analysis => {
          this.handleMLAnalysis(analysis, callback)
        })
        
      } catch (error) {
        console.error('ML polling error:', error)
      }
    }
    
    // Poll every 30 seconds for ML analysis
    const interval = setInterval(poll, 30000)
    this.pollingIntervals.set('ml', interval)
  }

  /**
   * Reconnection logic
   */
  attemptReconnect(connectionType, reconnectFunction) {
    const attempts = this.reconnectAttempts.get(connectionType) || 0
    
    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(connectionType, attempts + 1)
      
      console.log(`🔄 Attempting to reconnect ${connectionType} (${attempts + 1}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        reconnectFunction()
      }, this.reconnectDelay * Math.pow(2, attempts)) // Exponential backoff
    } else {
      console.error(`❌ Max reconnection attempts reached for ${connectionType}`)
    }
  }

  /**
   * Stop all monitoring
   */
  stopAllMonitoring() {
    // Close WebSocket connections
    this.connections.forEach((connection, type) => {
      if (connection.close) {
        connection.close()
      } else if (connection.disconnect) {
        connection.disconnect()
      }
      console.log(`Stopped ${type} monitoring`)
    })
    
    // Clear polling intervals
    this.pollingIntervals.forEach((interval, type) => {
      clearInterval(interval)
      console.log(`Stopped ${type} polling`)
    })
    
    this.connections.clear()
    this.pollingIntervals.clear()
    this.reconnectAttempts.clear()
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    const status = {}
    
    this.connections.forEach((connection, type) => {
      if (connection.readyState !== undefined) {
        // WebSocket
        status[type] = {
          connected: connection.readyState === WebSocket.OPEN,
          type: 'websocket'
        }
      } else if (connection.readyState !== undefined) {
        // Server-Sent Events
        status[type] = {
          connected: connection.readyState === EventSource.OPEN,
          type: 'sse'
        }
      } else {
        status[type] = {
          connected: true,
          type: 'polling'
        }
      }
    })
    
    return status
  }

  // Helper methods for impact estimation
  estimateAffectedUsers(analysisData) {
    // Simple estimation logic
    const severityMultipliers = {
      'critical': 1000,
      'high': 500,
      'medium': 100,
      'low': 10
    }
    
    return severityMultipliers[analysisData.severity] || 50
  }

  estimateDowntime(analysisData) {
    // Estimate based on alert type and severity
    const downtimeEstimates = {
      'database': '15-30 minutes',
      'network': '5-15 minutes',
      'application': '10-20 minutes',
      'infrastructure': '20-60 minutes'
    }
    
    return downtimeEstimates[analysisData.category] || '5-10 minutes'
  }

  estimateBusinessImpact(analysisData) {
    // Simple business impact calculation
    const impactLevels = {
      'critical': 'High - Revenue affecting',
      'high': 'Medium - Service degradation',
      'medium': 'Low - Minimal impact',
      'low': 'Negligible'
    }
    
    return impactLevels[analysisData.severity] || 'Unknown'
  }
}

// Create singleton instance
const service = new RealtimeMonitoringService()

// Export with method aliases for convenience
export const realtimeService = {
  ...service,
  stopAll: () => service.stopAllMonitoring() // Alias for backward compatibility
}

export default realtimeService
