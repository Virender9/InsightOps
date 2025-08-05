import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useTemperatureStore = defineStore('temperature', () => {
  const temperatureData = ref([])
  const historicalData = ref([])
  const loading = ref(false)
  const error = ref(null)
  let temperatureInterval = null

  // API configuration
  const API_BASE_URL = 'http://localhost:4000' // Mock API
  // TODO: Replace with real Helix Console API
  // const HELIX_TEMP_API = 'https://helix-console.example.com/api/v1/temperature'

  // Temperature thresholds
  const thresholds = ref({
    critical: 8.0, // °C
    warning: 7.0,  // °C
    normal: 5.0    // °C
  })

  // Computed properties
  const activeAlarms = computed(() => 
    temperatureData.value.filter(data => data.status === 'alarm')
  )

  const warningUnits = computed(() => 
    temperatureData.value.filter(data => data.status === 'warning')
  )

  const healthyUnits = computed(() => 
    temperatureData.value.filter(data => data.status === 'normal')
  )

  const averageTemperature = computed(() => {
    if (temperatureData.value.length === 0) return 0
    const sum = temperatureData.value.reduce((acc, data) => acc + data.temperature, 0)
    return Math.round((sum / temperatureData.value.length) * 10) / 10
  })

  const systemOverview = computed(() => {
    const total = temperatureData.value.length
    return {
      total,
      critical: activeAlarms.value.length,
      warning: warningUnits.value.length,
      healthy: healthyUnits.value.length,
      offline: 0 // TODO: Implement offline detection
    }
  })

  // Actions
  const fetchTemperatureData = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Using mock API for now
      const response = await axios.get(`${API_BASE_URL}/temperatureData`)
      temperatureData.value = response.data
      
      /* TODO: Integrate with Helix Console API
      const response = await axios.get(`${HELIX_TEMP_API}/current`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_HELIX_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          include_metadata: true,
          units: 'celsius'
        }
      })
      
      temperatureData.value = response.data.sensors.map(normalizeTemperatureData)
      */
      
    } catch (err) {
      error.value = 'Failed to fetch temperature data: ' + err.message
      console.error('Error fetching temperature data:', err)
    } finally {
      loading.value = false
    }
  }

  /* TODO: Uncomment when Helix API is available
  const normalizeTemperatureData = (sensor) => {
    return {
      id: sensor.id || sensor.sensor_id,
      fridgeId: sensor.device_id || sensor.fridge_id,
      temperature: sensor.temperature || sensor.temp_celsius,
      humidity: sensor.humidity || sensor.humidity_percent,
      timestamp: sensor.timestamp || sensor.last_reading,
      location: sensor.location || sensor.datacenter,
      status: determineStatus(sensor.temperature || sensor.temp_celsius)
    }
  }
  */

  const determineStatus = (temperature) => {
    if (temperature >= thresholds.value.critical) return 'alarm'
    if (temperature >= thresholds.value.warning) return 'warning'
    return 'normal'
  }

  const fetchHistoricalData = async (fridgeId, timeRange = '24h') => {
    loading.value = true
    
    try {
      const response = await axios.get(`${API_BASE_URL}/temperatureData`, {
        params: { fridgeId, timeRange }
      })
      
      // Generate mock historical data for demo
      const baseData = response.data.find(d => d.fridgeId === fridgeId)
      if (baseData) {
        historicalData.value = generateHistoricalData(baseData, timeRange)
      }
      
      /* TODO: Real API integration
      const response = await axios.get(`${HELIX_TEMP_API}/history`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_HELIX_API_KEY}`
        },
        params: {
          device_id: fridgeId,
          time_range: timeRange,
          granularity: '5m'
        }
      })
      
      historicalData.value = response.data.readings.map(normalizeTemperatureData)
      */
      
    } catch (err) {
      error.value = 'Failed to fetch historical data: ' + err.message
      console.error('Error fetching historical data:', err)
    } finally {
      loading.value = false
    }
  }

  const generateHistoricalData = (baseData, timeRange) => {
    const points = timeRange === '24h' ? 288 : timeRange === '1h' ? 12 : 72 // 5min intervals
    const interval = timeRange === '24h' ? 5 * 60 * 1000 : timeRange === '1h' ? 5 * 60 * 1000 : 60 * 60 * 1000
    
    const historical = []
    const now = new Date()
    
    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * interval))
      const tempVariation = (Math.random() - 0.5) * 2 // ±1°C variation
      const timeOfDayEffect = Math.sin((timestamp.getHours() / 24) * 2 * Math.PI) * 0.5
      
      const temperature = Math.round((baseData.temperature + tempVariation + timeOfDayEffect) * 10) / 10
      const humidity = Math.round((baseData.humidity + (Math.random() - 0.5) * 10) * 10) / 10
      
      historical.push({
        id: `${baseData.fridgeId}_${timestamp.getTime()}`,
        fridgeId: baseData.fridgeId,
        temperature,
        humidity: Math.max(30, Math.min(80, humidity)),
        timestamp: timestamp.toISOString(),
        location: baseData.location,
        status: determineStatus(temperature)
      })
    }
    
    return historical
  }

  // Real-time temperature monitoring
  const startRealTimeMonitoring = () => {
    /* TODO: Implement WebSocket connection for real-time updates
    const ws = new WebSocket(`${HELIX_TEMP_WS}/temperature/stream`)
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      const normalizedData = normalizeTemperatureData(update)
      
      // Update existing data or add new
      const index = temperatureData.value.findIndex(d => d.fridgeId === normalizedData.fridgeId)
      if (index !== -1) {
        temperatureData.value[index] = normalizedData
      } else {
        temperatureData.value.push(normalizedData)
      }
      
      // Trigger alerts if needed
      checkTemperatureAlerts(normalizedData)
    }
    
    return ws
    */
    
    // Clean up existing interval
    if (temperatureInterval) {
      clearInterval(temperatureInterval)
    }
    
    // Mock real-time updates for development
    temperatureInterval = setInterval(() => {
      temperatureData.value = temperatureData.value.map(data => ({
        ...data,
        temperature: Math.round((data.temperature + (Math.random() - 0.5) * 0.5) * 10) / 10,
        humidity: Math.max(30, Math.min(80, 
          Math.round((data.humidity + (Math.random() - 0.5) * 2) * 10) / 10
        )),
        timestamp: new Date().toISOString(),
        status: determineStatus(data.temperature + (Math.random() - 0.5) * 0.5)
      }))
    }, 30000) // Update every 30 seconds
    
    return temperatureInterval
  }
  
  const stopRealTimeMonitoring = () => {
    if (temperatureInterval) {
      clearInterval(temperatureInterval)
      temperatureInterval = null
    }
  }
  
  // Cleanup method for component unmount
  const destroy = () => {
    stopRealTimeMonitoring()
  }

  const checkTemperatureAlerts = (temperatureData) => {
    const alerts = []
    
    temperatureData.forEach(data => {
      if (data.status === 'alarm') {
        alerts.push({
          type: 'temperature_critical',
          fridgeId: data.fridgeId,
          temperature: data.temperature,
          threshold: thresholds.value.critical,
          location: data.location,
          timestamp: data.timestamp
        })
      } else if (data.status === 'warning') {
        alerts.push({
          type: 'temperature_warning',
          fridgeId: data.fridgeId,
          temperature: data.temperature,
          threshold: thresholds.value.warning,
          location: data.location,
          timestamp: data.timestamp
        })
      }
    })
    
    return alerts
  }

  // Temperature analytics
  const getTemperatureTrends = (fridgeId, period = '24h') => {
    const data = historicalData.value.filter(d => d.fridgeId === fridgeId)
    if (data.length < 2) return { trend: 'stable', change: 0 }
    
    const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    const first = sortedData[0].temperature
    const last = sortedData[sortedData.length - 1].temperature
    const change = last - first
    
    let trend = 'stable'
    if (Math.abs(change) > 0.5) {
      trend = change > 0 ? 'increasing' : 'decreasing'
    }
    
    return { trend, change: Math.round(change * 10) / 10 }
  }

  const getTemperatureStatistics = (fridgeId = null) => {
    const data = fridgeId ? 
      temperatureData.value.filter(d => d.fridgeId === fridgeId) : 
      temperatureData.value
      
    if (data.length === 0) return null
    
    const temperatures = data.map(d => d.temperature)
    const min = Math.min(...temperatures)
    const max = Math.max(...temperatures)
    const avg = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length
    
    return {
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      average: Math.round(avg * 10) / 10,
      range: Math.round((max - min) * 10) / 10
    }
  }

  // Predictive analytics
  const predictTemperatureAnomaly = async (fridgeId) => {
    try {
      /* TODO: Implement ML-based prediction
      const response = await axios.post(`${ML_API_URL}/api/v1/predict/temperature`, {
        fridge_id: fridgeId,
        historical_data: historicalData.value.filter(d => d.fridgeId === fridgeId),
        prediction_window: '2h'
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_ML_API_KEY}`
        }
      })
      
      return response.data.predictions
      */
      
      // Mock prediction for development
      const currentData = temperatureData.value.find(d => d.fridgeId === fridgeId)
      if (!currentData) return null
      
      const isRisingTrend = currentData.temperature > thresholds.value.warning
      const anomalyScore = Math.random() * (isRisingTrend ? 0.8 : 0.3)
      
      return {
        anomaly_score: anomalyScore,
        predicted_peak: currentData.temperature + (isRisingTrend ? 2 : -0.5),
        time_to_critical: isRisingTrend ? Math.random() * 60 : null, // minutes
        confidence: 0.75,
        factors: [
          'Historical temperature pattern',
          'Seasonal variation',
          'Cooling system efficiency'
        ]
      }
    } catch (err) {
      console.error('Failed to predict temperature anomaly:', err)
      return null
    }
  }

  // Configuration management
  const updateThresholds = async (newThresholds) => {
    try {
      await axios.patch(`${API_BASE_URL}/config/temperature-thresholds`, newThresholds)
      thresholds.value = { ...thresholds.value, ...newThresholds }
      
      // Re-evaluate all current statuses
      temperatureData.value = temperatureData.value.map(data => ({
        ...data,
        status: determineStatus(data.temperature)
      }))
      
    } catch (err) {
      error.value = 'Failed to update thresholds: ' + err.message
      throw err
    }
  }

  // Data export
  const exportTemperatureData = (format = 'json', timeRange = '24h') => {
    const data = {
      exported_at: new Date().toISOString(),
      time_range: timeRange,
      thresholds: thresholds.value,
      current_readings: temperatureData.value,
      system_overview: systemOverview.value,
      statistics: getTemperatureStatistics()
    }
    
    if (format === 'csv') {
      const csvHeaders = 'timestamp,fridgeId,temperature,humidity,status,location\n'
      const csvData = temperatureData.value.map(d => 
        `${d.timestamp},${d.fridgeId},${d.temperature},${d.humidity},${d.status},${d.location}`
      ).join('\n')
      
      return csvHeaders + csvData
    }
    
    return JSON.stringify(data, null, 2)
  }

  // Maintenance scheduling
  const getMaintenanceSchedule = (fridgeId) => {
    const data = temperatureData.value.find(d => d.fridgeId === fridgeId)
    if (!data) return null
    
    // Mock maintenance logic based on temperature patterns
    const needsMaintenance = data.status === 'alarm' || data.temperature > thresholds.value.warning
    
    return {
      fridgeId,
      next_maintenance: needsMaintenance ? 'immediate' : '30 days',
      priority: data.status === 'alarm' ? 'critical' : 'routine',
      recommended_actions: needsMaintenance ? [
        'Check cooling system',
        'Verify sensor calibration',
        'Inspect door seals'
      ] : [
        'Routine inspection',
        'Sensor cleaning'
      ]
    }
  }

  // Additional getters for AIOperationalIntelligence component
  const getAllReadings = () => {
    return temperatureData.value
  }

  const getActiveSensors = () => {
    return temperatureData.value.filter(item => item.status === 'Normal' || item.status === 'Warning')
  }

  const getThresholds = () => {
    return thresholds.value
  }

  return {
    // State
    temperatureData,
    historicalData,
    thresholds,
    loading,
    error,
    
    // Computed
    activeAlarms,
    warningUnits,
    healthyUnits,
    averageTemperature,
    systemOverview,
    
    // Getters
    getAllReadings,
    getActiveSensors,
    getThresholds,
    
    // Actions
    fetchTemperatureData,
    fetchHistoricalData,
    startRealTimeMonitoring,
    stopRealTimeMonitoring,
    destroy,
    getTemperatureTrends,
    getTemperatureStatistics,
    predictTemperatureAnomaly,
    updateThresholds,
    exportTemperatureData,
    getMaintenanceSchedule
  }
})
