import axios from 'axios'

// API Configuration
const API_CONFIG = {
  // Mock API (currently active)
  MOCK_API: {
    baseURL: 'http://localhost:4000',
    timeout: 10000
  },
  
  // TODO: Replace with real API endpoints when available
  /*
  HELIX_API: {
    baseURL: import.meta.env.VITE_HELIX_API_URL || 'https://helix-console-api.example.com',
    apiKey: import.meta.env.VITE_HELIX_API_KEY,
    timeout: 15000
  },
  
  SWIFT_API: {
    baseURL: import.meta.env.VITE_SWIFT_API_URL || 'https://swift-console-api.example.com', 
    apiKey: import.meta.env.VITE_SWIFT_API_KEY,
    timeout: 15000
  },
  
  ML_BACKEND: {
    baseURL: import.meta.env.VITE_ML_BACKEND_URL || 'http://localhost:8000',
    apiKey: import.meta.env.VITE_ML_API_KEY,
    timeout: 30000 // ML operations can take longer
  },
  
  AZURE_OPENAI: {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
    apiKey: import.meta.env.VITE_AZURE_OPENAI_KEY,
    deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4-turbo',
    apiVersion: '2023-12-01-preview'
  }
  */
}

// Environment flag to control which APIs to use
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

// Create axios instances for different services
const createApiInstance = (config, name) => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add authentication headers based on service
      if (name === 'helix' && API_CONFIG.HELIX_API?.apiKey) {
        config.headers.Authorization = `Bearer ${API_CONFIG.HELIX_API.apiKey}`
      } else if (name === 'swift' && API_CONFIG.SWIFT_API?.apiKey) {
        config.headers['X-API-Key'] = API_CONFIG.SWIFT_API.apiKey
      } else if (name === 'ml' && API_CONFIG.ML_BACKEND?.apiKey) {
        config.headers.Authorization = `Bearer ${API_CONFIG.ML_BACKEND.apiKey}`
      } else if (name === 'azure' && API_CONFIG.AZURE_OPENAI?.apiKey) {
        config.headers['api-key'] = API_CONFIG.AZURE_OPENAI.apiKey
      }

      console.log(`[${name.toUpperCase()} API] ${config.method?.toUpperCase()} ${config.url}`)
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      console.log(`[${name.toUpperCase()} API] Response:`, response.status, response.statusText)
      return response
    },
    (error) => {
      console.error(`[${name.toUpperCase()} API] Error:`, error.message)
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        console.error(`[${name.toUpperCase()} API] Authentication failed - check API key`)
      } else if (error.response?.status === 429) {
        console.error(`[${name.toUpperCase()} API] Rate limit exceeded`)
      } else if (error.code === 'ECONNABORTED') {
        console.error(`[${name.toUpperCase()} API] Request timeout`)
      }
      
      return Promise.reject(error)
    }
  )

  return instance
}

// API instances
export const mockApi = createApiInstance(API_CONFIG.MOCK_API, 'mock')

/* TODO: Uncomment when real APIs are configured
export const helixApi = createApiInstance(API_CONFIG.HELIX_API, 'helix')
export const swiftApi = createApiInstance(API_CONFIG.SWIFT_API, 'swift') 
export const mlApi = createApiInstance(API_CONFIG.ML_BACKEND, 'ml')
export const azureOpenAI = createApiInstance({
  baseURL: `${API_CONFIG.AZURE_OPENAI.endpoint}/openai/deployments/${API_CONFIG.AZURE_OPENAI.deployment}`,
  timeout: 30000
}, 'azure')
*/

// Generic API service class
class ApiService {
  constructor() {
    this.mockMode = USE_MOCK_DATA
    this.retryAttempts = 3
    this.retryDelay = 1000
  }

  async request(apiInstance, config, retryCount = 0) {
    try {
      const response = await apiInstance(config)
      return response.data
    } catch (error) {
      if (retryCount < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`Retrying request (${retryCount + 1}/${this.retryAttempts})`)
        await this.delay(this.retryDelay * (retryCount + 1))
        return this.request(apiInstance, config, retryCount + 1)
      }
      
      // Fallback to mock data in production if real API fails
      if (!this.mockMode && import.meta.env.MODE === 'production') {
        console.warn('Falling back to mock data due to API failure')
        return this.getMockFallback(config.url, config.method)
      }
      
      throw error
    }
  }

  shouldRetry(error) {
    const retryableErrors = ['ECONNABORTED', 'ENOTFOUND', 'ECONNREFUSED']
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
    
    return (
      retryableErrors.includes(error.code) ||
      retryableStatusCodes.includes(error.response?.status)
    )
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getMockFallback(url, method) {
    // Return basic mock data structure
    return {
      success: false,
      error: 'API unavailable - using fallback data',
      data: [],
      timestamp: new Date().toISOString()
    }
  }

  // Health check for all services
  async healthCheck() {
    const services = []
    
    // Check mock API
    try {
      await mockApi.get('/health')
      services.push({ name: 'Mock API', status: 'healthy', endpoint: API_CONFIG.MOCK_API.baseURL })
    } catch (error) {
      services.push({ name: 'Mock API', status: 'unhealthy', error: error.message })
    }

    /* TODO: Uncomment for real API health checks
    // Check Helix API
    if (!this.mockMode && API_CONFIG.HELIX_API) {
      try {
        await helixApi.get('/health')
        services.push({ name: 'Helix API', status: 'healthy', endpoint: API_CONFIG.HELIX_API.baseURL })
      } catch (error) {
        services.push({ name: 'Helix API', status: 'unhealthy', error: error.message })
      }
    }

    // Check Swift API  
    if (!this.mockMode && API_CONFIG.SWIFT_API) {
      try {
        await swiftApi.get('/health')
        services.push({ name: 'Swift API', status: 'healthy', endpoint: API_CONFIG.SWIFT_API.baseURL })
      } catch (error) {
        services.push({ name: 'Swift API', status: 'unhealthy', error: error.message })
      }
    }

    // Check ML Backend
    if (!this.mockMode && API_CONFIG.ML_BACKEND) {
      try {
        await mlApi.get('/health')
        services.push({ name: 'ML Backend', status: 'healthy', endpoint: API_CONFIG.ML_BACKEND.baseURL })
      } catch (error) {
        services.push({ name: 'ML Backend', status: 'unhealthy', error: error.message })
      }
    }
    */

    return {
      overall: services.every(s => s.status === 'healthy') ? 'healthy' : 'degraded',
      services,
      timestamp: new Date().toISOString(),
      mockMode: this.mockMode
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Specific API methods for different data types
export const alertsApi = {
  async getAlerts(params = {}) {
    if (USE_MOCK_DATA) {
      return apiService.request(mockApi, { method: 'GET', url: '/alerts', params })
    }
    
    /* TODO: Integrate with real APIs
    // Try Helix API first, then Swift API as fallback
    try {
      const helixData = await apiService.request(helixApi, {
        method: 'GET',
        url: '/api/v1/alerts',
        params: { ...params, format: 'json' }
      })
      return normalizeHelixAlerts(helixData)
    } catch (error) {
      console.warn('Helix API failed, trying Swift API')
      const swiftData = await apiService.request(swiftApi, {
        method: 'GET', 
        url: '/api/alerts',
        params: { ...params, include_metadata: true }
      })
      return normalizeSwiftAlerts(swiftData)
    }
    */
  },

  async createAlert(alertData) {
    return apiService.request(mockApi, {
      method: 'POST',
      url: '/alerts',
      data: alertData
    })
  },

  async updateAlert(id, updates) {
    return apiService.request(mockApi, {
      method: 'PATCH',
      url: `/alerts/${id}`,
      data: updates
    })
  }
}

export const metricsApi = {
  async getMetrics(params = {}) {
    return apiService.request(mockApi, {
      method: 'GET',
      url: '/metrics',
      params
    })
  },

  async getServerMetrics(serverId) {
    return apiService.request(mockApi, {
      method: 'GET',
      url: `/metrics/server/${serverId}`
    })
  }
}

export const temperatureApi = {
  async getTemperatureData(params = {}) {
    return apiService.request(mockApi, {
      method: 'GET',
      url: '/temperatureData',
      params
    })
  },

  async getHistoricalData(fridgeId, timeRange) {
    return apiService.request(mockApi, {
      method: 'GET',
      url: `/temperatureData/history/${fridgeId}`,
      params: { timeRange }
    })
  }
}

export const rcaApi = {
  async getRCAFlows(params = {}) {
    return apiService.request(mockApi, {
      method: 'GET',
      url: '/rcaFlows',
      params
    })
  },

  async createRCA(rcaData) {
    return apiService.request(mockApi, {
      method: 'POST',
      url: '/rcaFlows',
      data: rcaData
    })
  },

  async updateRCA(id, updates) {
    return apiService.request(mockApi, {
      method: 'PATCH',
      url: `/rcaFlows/${id}`,
      data: updates
    })
  }
}

export const anomalyApi = {
  async getAnomalies(params = {}) {
    return apiService.request(mockApi, {
      method: 'GET',
      url: '/anomalies',
      params
    })
  },

  /* TODO: ML Backend integration
  async detectAnomalies(metricsData) {
    return apiService.request(mlApi, {
      method: 'POST',
      url: '/api/v1/detect',
      data: {
        metrics: metricsData,
        algorithms: ['isolation_forest', 'z_score', 'lstm_autoencoder'],
        thresholds: {
          isolation_forest: 0.7,
          z_score: 3.0,
          lstm_autoencoder: 0.75
        }
      }
    })
  },

  async trainModel(trainingData, modelType = 'isolation_forest') {
    return apiService.request(mlApi, {
      method: 'POST',
      url: '/api/v1/train',
      data: {
        training_data: trainingData,
        model_type: modelType,
        hyperparameters: {
          n_estimators: 100,
          contamination: 0.1,
          random_state: 42
        }
      }
    })
  }
  */
}

export const aiApi = {
  async getSummaries(params = {}) {
    return apiService.request(mockApi, {
      method: 'GET',
      url: '/aiSummaries', 
      params
    })
  },

  /* TODO: Azure OpenAI integration
  async generateSummary(prompt, context = {}) {
    return apiService.request(azureOpenAI, {
      method: 'POST',
      url: `/chat/completions?api-version=${API_CONFIG.AZURE_OPENAI.apiVersion}`,
      data: {
        messages: [
          {
            role: 'system',
            content: 'You are an expert in IT operations and root cause analysis. Provide clear, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }
    })
  }
  */
}

// Data normalization functions (TODO: Implement when real APIs are integrated)
/*
const normalizeHelixAlerts = (helixData) => {
  return helixData.alerts?.map(alert => ({
    id: alert.id,
    type: alert.alert_type?.toLowerCase(),
    severity: alert.severity?.toLowerCase(),
    source: alert.source || alert.hostname,
    message: alert.message || alert.description,
    value: alert.current_value,
    threshold: alert.threshold,
    timestamp: alert.timestamp || alert.created_at,
    status: alert.resolved ? 'resolved' : 'active',
    location: alert.location,
    metadata: alert.metadata
  })) || []
}

const normalizeSwiftAlerts = (swiftData) => {
  return swiftData?.map(alert => ({
    id: alert.alert_id || alert.id,
    type: alert.category?.toLowerCase(),
    severity: alert.priority?.toLowerCase(),
    source: alert.device || alert.source,
    message: alert.description || alert.message,
    value: alert.value,
    threshold: alert.threshold_value,
    timestamp: alert.time || alert.timestamp,
    status: alert.status === 'open' ? 'active' : 'resolved',
    location: alert.datacenter,
    metadata: alert.details
  })) || []
}
*/

export default apiService
