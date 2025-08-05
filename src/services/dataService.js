import axios from 'axios'

// Configuration for API switching
const API_MODE = import.meta.env.VITE_API_MODE || 'sample' // 'sample' or 'live'

// Live API Configuration
const LIVE_API_CONFIG = {
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
    timeout: 30000
  }
}

// Sample Data for Enterprise Dashboard
const SAMPLE_DATA = {
  servers: [
    {
      id: 'srv-001',
      name: 'WEB-PROD-01',
      location: 'US-East-1',
      type: 'web',
      status: 'healthy',
      cpu: 23.5,
      memory: 45.2,
      disk: 67.8,
      network: 12.3,
      uptime: 99.9,
      lastUpdated: new Date(Date.now() - 60000).toISOString()
    },
    {
      id: 'srv-002',
      name: 'DB-PROD-01',
      location: 'US-East-1',
      type: 'database',
      status: 'warning',
      cpu: 78.9,
      memory: 89.4,
      disk: 34.6,
      network: 45.7,
      uptime: 99.7,
      lastUpdated: new Date(Date.now() - 120000).toISOString()
    },
    {
      id: 'srv-003',
      name: 'API-PROD-01',
      location: 'EU-West-1',
      type: 'api',
      status: 'critical',
      cpu: 92.1,
      memory: 95.8,
      disk: 87.2,
      network: 78.4,
      uptime: 97.2,
      lastUpdated: new Date(Date.now() - 180000).toISOString()
    },
    {
      id: 'srv-004',
      name: 'CACHE-PROD-01',
      location: 'US-West-1',
      type: 'cache',
      status: 'healthy',
      cpu: 34.2,
      memory: 56.7,
      disk: 23.1,
      network: 67.8,
      uptime: 99.8,
      lastUpdated: new Date(Date.now() - 90000).toISOString()
    }
  ],

  alerts: [
    {
      id: 'alert-001',
      title: 'High CPU Usage on DB-PROD-01',
      severity: 'critical',
      status: 'open',
      serverId: 'srv-002',
      serverName: 'DB-PROD-01',
      description: 'CPU usage has exceeded 75% threshold for 15 minutes',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      category: 'performance',
      tags: ['cpu', 'database', 'threshold'],
      assignedTo: 'ops-team',
      affectedServices: ['user-auth', 'order-processing']
    },
    {
      id: 'alert-002',
      title: 'Memory Usage Critical on API-PROD-01',
      severity: 'critical',
      status: 'acknowledged',
      serverId: 'srv-003',
      serverName: 'API-PROD-01',
      description: 'Memory usage at 95.8%, potential memory leak detected',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      category: 'performance',
      tags: ['memory', 'api', 'leak'],
      assignedTo: 'dev-team',
      affectedServices: ['payment-api', 'notification-service']
    },
    {
      id: 'alert-003',
      title: 'Disk Space Warning on WEB-PROD-01',
      severity: 'warning',
      status: 'resolved',
      serverId: 'srv-001',
      serverName: 'WEB-PROD-01',
      description: 'Disk usage at 67.8%, cleanup required soon',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      category: 'storage',
      tags: ['disk', 'web', 'cleanup'],
      assignedTo: 'ops-team',
      affectedServices: ['web-frontend']
    }
  ],

  metrics: {
    overview: {
      totalServers: 4,
      healthyServers: 2,
      warningServers: 1,
      criticalServers: 1,
      averageUptime: 99.4,
      totalAlerts: 3,
      activeIncidents: 2
    },
    performance: [
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        cpu: 45.2,
        memory: 67.8,
        network: 34.5,
        responseTime: 120
      },
      {
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        cpu: 52.1,
        memory: 71.3,
        network: 42.1,
        responseTime: 145
      },
      {
        timestamp: new Date(Date.now() - 900000).toISOString(),
        cpu: 67.8,
        memory: 78.9,
        network: 56.7,
        responseTime: 178
      },
      {
        timestamp: new Date().toISOString(),
        cpu: 72.4,
        memory: 82.3,
        network: 61.2,
        responseTime: 195
      }
    ]
  },

  fridges: [
    {
      id: 'fridge-001',
      name: 'Storage Unit A1',
      location: 'Warehouse North',
      status: 'healthy',
      temperature: 4.2,
      humidity: 65.3,
      targetTemp: 4.0,
      lastMaintenance: '2024-07-15',
      nextMaintenance: '2024-08-15',
      energyConsumption: 145.6,
      doorOpenings: 23,
      compressorCycles: 156
    },
    {
      id: 'fridge-002',
      name: 'Storage Unit B2',
      location: 'Warehouse South',
      status: 'warning',
      temperature: 6.8,
      humidity: 72.1,
      targetTemp: 4.0,
      lastMaintenance: '2024-06-20',
      nextMaintenance: '2024-08-20',
      energyConsumption: 178.9,
      doorOpenings: 45,
      compressorCycles: 234
    },
    {
      id: 'fridge-003',
      name: 'Storage Unit C3',
      location: 'Warehouse East',
      status: 'critical',
      temperature: 8.5,
      humidity: 78.4,
      targetTemp: 4.0,
      lastMaintenance: '2024-05-10',
      nextMaintenance: '2024-08-10',
      energyConsumption: 201.3,
      doorOpenings: 67,
      compressorCycles: 345
    }
  ],

  incidents: [
    {
      id: 'inc-001',
      title: 'Database Performance Degradation',
      status: 'investigating',
      priority: 'high',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      assignee: 'John Doe',
      affectedSystems: ['DB-PROD-01', 'API-PROD-01'],
      description: 'Database queries taking longer than normal, affecting API response times',
      timeline: [
        {
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action: 'Incident created',
          user: 'System'
        },
        {
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          action: 'Assigned to John Doe',
          user: 'Operations Team'
        },
        {
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          action: 'Investigation started',
          user: 'John Doe'
        }
      ]
    },
    {
      id: 'inc-002',
      title: 'API Gateway Timeout',
      status: 'open',
      priority: 'critical',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      assignee: null,
      affectedSystems: ['API-GATEWAY-01', 'LB-PROD-01'],
      description: 'API Gateway experiencing timeout errors, affecting multiple services',
      timeline: [
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: 'Incident created',
          user: 'System'
        }
      ]
    },
    {
      id: 'inc-003',
      title: 'Storage Capacity Warning',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString(),
      assignee: 'Sarah Wilson',
      affectedSystems: ['STORAGE-01'],
      description: 'Storage utilization reached 85%, cleanup required',
      timeline: [
        {
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          action: 'Incident created',
          user: 'System'
        },
        {
          timestamp: new Date(Date.now() - 9000000).toISOString(),
          action: 'Assigned to Sarah Wilson',
          user: 'Operations Team'
        },
        {
          timestamp: new Date(Date.now() - 900000).toISOString(),
          action: 'Cleanup started',
          user: 'Sarah Wilson'
        }
      ]
    },
    {
      id: 'inc-004',
      title: 'Memory Leak in Web Service',
      status: 'resolved',
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      assignee: 'Mike Johnson',
      affectedSystems: ['WEB-PROD-02'],
      description: 'Memory leak causing service instability, resolved with deployment',
      timeline: [
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          action: 'Incident created',
          user: 'System'
        },
        {
          timestamp: new Date(Date.now() - 82800000).toISOString(),
          action: 'Assigned to Mike Johnson',
          user: 'Operations Team'
        },
        {
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action: 'Root cause identified',
          user: 'Mike Johnson'
        },
        {
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          action: 'Fix deployed and verified',
          user: 'Mike Johnson'
        }
      ]
    },
    {
      id: 'inc-005',
      title: 'SSL Certificate Expiration',
      status: 'open',
      priority: 'critical',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      assignee: 'DevOps Team',
      affectedSystems: ['WEB-PROD-01', 'API-PROD-01', 'API-PROD-02'],
      description: 'SSL certificate expired for production domain, immediate renewal required',
      timeline: [
        {
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          action: 'Incident created',
          user: 'Automated Monitor'
        },
        {
          timestamp: new Date(Date.now() - 1680000).toISOString(),
          action: 'Assigned to DevOps Team',
          user: 'Security Team'
        }
      ]
    }
  ]
}

// Data Service Class
class DataService {
  constructor() {
    this.apiInstances = {}
    this.initializeApiInstances()
  }

  initializeApiInstances() {
    if (API_MODE === 'live') {
      Object.entries(LIVE_API_CONFIG).forEach(([key, config]) => {
        this.apiInstances[key] = axios.create({
          baseURL: config.baseURL,
          timeout: config.timeout,
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
          }
        })
      })
    }
  }

  // Generic method to handle API mode switching
  async getData(endpoint, liveApiCall = null) {
    if (API_MODE === 'sample') {
      // Return sample data based on endpoint
      return this.getSampleData(endpoint)
    } else if (API_MODE === 'live' && liveApiCall) {
      try {
        return await liveApiCall()
      } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error)
        // Fallback to sample data if API fails
        return this.getSampleData(endpoint)
      }
    }
    
    return this.getSampleData(endpoint)
  }

  getSampleData(endpoint) {
    const delay = Math.random() * 1000 + 500 // Simulate network delay
    
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (endpoint) {
          case 'servers':
            resolve({ data: SAMPLE_DATA.servers })
            break
          case 'alerts':
            resolve({ data: SAMPLE_DATA.alerts })
            break
          case 'metrics':
            resolve({ data: SAMPLE_DATA.metrics })
            break
          case 'fridges':
            resolve({ data: SAMPLE_DATA.fridges })
            break
          case 'incidents':
            resolve({ data: SAMPLE_DATA.incidents })
            break
          default:
            resolve({ data: [] })
        }
      }, delay)
    })
  }

  // Server Methods
  async getServers() {
    return this.getData('servers', async () => {
      const response = await this.apiInstances.HELIX_API.get('/api/servers')
      return response
    })
  }

  async getServerById(id) {
    if (API_MODE === 'sample') {
      const servers = SAMPLE_DATA.servers
      return { data: servers.find(s => s.id === id) }
    }
    return this.apiInstances.HELIX_API.get(`/api/servers/${id}`)
  }

  // Alert Methods
  async getAlerts() {
    return this.getData('alerts', async () => {
      const response = await this.apiInstances.SWIFT_API.get('/api/alerts')
      return response
    })
  }

  async updateAlertStatus(id, status) {
    if (API_MODE === 'sample') {
      const alert = SAMPLE_DATA.alerts.find(a => a.id === id)
      if (alert) {
        alert.status = status
        alert.updatedAt = new Date().toISOString()
      }
      return { data: alert }
    }
    return this.apiInstances.SWIFT_API.patch(`/api/alerts/${id}`, { status })
  }

  // Metrics Methods
  async getMetrics() {
    return this.getData('metrics', async () => {
      const response = await this.apiInstances.HELIX_API.get('/api/metrics')
      return response
    })
  }

  // Fridge Methods
  async getFridges() {
    return this.getData('fridges', async () => {
      const response = await this.apiInstances.HELIX_API.get('/api/fridges')
      return response
    })
  }

  // Incident Methods
  async getIncidents() {
    return this.getData('incidents', async () => {
      const response = await this.apiInstances.SWIFT_API.get('/api/incidents')
      return response
    })
  }

  // Utility method to get current API mode
  getApiMode() {
    return API_MODE
  }

  // Method to check API health
  async checkApiHealth() {
    if (API_MODE === 'sample') {
      return { status: 'healthy', mode: 'sample' }
    }

    const healthChecks = {}
    for (const [key, instance] of Object.entries(this.apiInstances)) {
      try {
        await instance.get('/health')
        healthChecks[key] = 'healthy'
      } catch (error) {
        healthChecks[key] = 'unhealthy'
      }
    }

    return { status: 'checked', mode: 'live', services: healthChecks }
  }
}

// Export singleton instance
export const dataService = new DataService()
export default dataService
