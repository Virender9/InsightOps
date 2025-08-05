<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Professional Header -->
    <header class="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="bg-white rounded-lg p-2">
              <Activity class="w-8 h-8 text-blue-600" />
            </div>
            <div class="text-white">
              <h1 class="text-2xl font-bold">InsightOps Dashboard</h1>
              <p class="text-sm opacity-90">Intelligent System Monitoring & Analytics</p>
            </div>
            <div class="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <div :class="[
                'w-3 h-3 rounded-full animate-pulse',
                systemStatus.color.includes('green') ? 'bg-green-400' :
                systemStatus.color.includes('yellow') ? 'bg-yellow-400' : 'bg-red-400'
              ]"></div>
              <span class="text-white text-sm font-medium">{{ systemStatus.text }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-white opacity-90 flex items-center">
              <Clock class="w-4 h-4 mr-1" />
              {{ formatTime(Date.now()) }}
            </div>
            <button
              @click="refreshData"
              :disabled="isRefreshing"
              class="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 disabled:opacity-50 flex items-center space-x-2 transition-all"
            >
              <RefreshCw :class="['w-4 h-4', isRefreshing && 'animate-spin']" />
              <span class="text-sm">{{ isRefreshing ? 'Refreshing...' : 'Refresh Data' }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Key Metrics Bar -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          :value="metrics.criticalAlerts" 
          label="Critical Alerts" 
          color="text-red-600"
          :trend="metrics.alertsTrend"
        />
        <MetricCard 
          :value="metrics.systemHealth + '%'" 
          label="System Health" 
          color="text-green-600"
          :trend="metrics.healthTrend"
        />
        <MetricCard 
          :value="metrics.activeIncidents" 
          label="Active Incidents" 
          color="text-orange-600"
          :trend="metrics.incidentsTrend"
        />
        <MetricCard 
          :value="metrics.avgLatency + 'ms'" 
          label="Avg Latency" 
          color="text-blue-600"
          :trend="metrics.latencyTrend"
        />
      </div>
    </div>

    <!-- Server Selection Bar -->
    <div class="bg-white border-b border-gray-200 px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700">Monitoring View:</span>
          <select 
            v-model="selectedView" 
            @change="updateMetricsView"
            class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="aggregate">All Servers (Aggregate)</option>
            <option value="server-01">WEB-SERVER-01 (Primary)</option>
            <option value="server-02">DB-SERVER-01 (Database)</option>
            <option value="server-03">APP-SERVER-01 (Application)</option>
            <option value="server-04">LB-SERVER-01 (Load Balancer)</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <Monitor class="w-4 h-4 text-gray-500" />
            <span class="text-sm text-gray-600">{{ activeServersCount }} of {{ totalServersCount }} servers active</span>
          </div>
          <div class="flex items-center space-x-2">
            <Globe class="w-4 h-4 text-gray-500" />
            <span class="text-sm text-gray-600">{{ currentServerLocation }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Alerts -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center">
              <AlertTriangle class="w-5 h-5 mr-2 text-red-500" />
              Recent Alerts
            </h2>
            <span class="text-sm text-gray-500">{{ alerts.length }} total</span>
          </div>
          
          <div class="space-y-3 max-h-80 overflow-y-auto">
            <div 
              v-for="alert in alerts.slice(0, 5)" 
              :key="alert.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div :class="getSeverityColor(alert.severity)" class="w-3 h-3 rounded-full"></div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ alert.message }}</p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{{ formatTime(alert.timestamp) }}</span>
                    <span class="text-gray-300">•</span>
                    <span class="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{{ alert.source || 'WEB-SERVER-01' }}</span>
                  </div>
                </div>
              </div>
              <span :class="getSeverityTextColor(alert.severity)" class="text-xs font-medium px-2 py-1 rounded-full bg-opacity-20">
                {{ alert.severity }}
              </span>
            </div>
            
            <div v-if="alerts.length === 0" class="text-center py-8 text-gray-500">
              <CheckCircle class="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No active alerts</p>
            </div>
          </div>
        </div>

        <!-- System Performance -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart3 class="w-5 h-5 mr-2 text-blue-500" />
              {{ selectedServerName }} Performance
            </h2>
            <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {{ selectedServerInfo.type }} | {{ selectedServerInfo.ip }}
            </div>
          </div>
          
          <div class="space-y-4">
            <PerformanceBar 
              label="CPU Usage" 
              :value="performance.cpu" 
              :threshold="80"
              color="blue"
            />
            <PerformanceBar 
              label="Memory Usage" 
              :value="performance.memory" 
              :threshold="85"
              color="green"
            />
            <PerformanceBar 
              label="Disk Usage" 
              :value="performance.disk" 
              :threshold="90"
              color="purple"
            />
            <PerformanceBar 
              label="Network I/O" 
              :value="performance.network" 
              :threshold="75"
              color="orange"
            />
          </div>
        </div>

        <!-- Recent Incidents -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center">
              <Zap class="w-5 h-5 mr-2 text-yellow-500" />
              Recent Incidents
            </h2>
            <router-link 
              to="/incidents" 
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </router-link>
          </div>
          
          <div class="space-y-3 max-h-80 overflow-y-auto">
            <div 
              v-for="incident in incidents.slice(0, 4)" 
              :key="incident.id"
              class="border border-gray-200 rounded-lg p-3"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900 text-sm">{{ incident.title }}</span>
                <span :class="getPriorityColor(incident.priority)" class="text-xs font-medium px-2 py-1 rounded-full">
                  {{ incident.priority }}
                </span>
              </div>
              <p class="text-xs text-gray-600 mb-2">{{ incident.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center space-x-2">
                  <span>{{ formatTime(incident.createdAt) }}</span>
                  <span class="text-gray-300">•</span>
                  <span class="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{{ incident.server || 'DB-SERVER-01' }}</span>
                </div>
                <span class="capitalize">{{ incident.status }}</span>
              </div>
            </div>
            
            <div v-if="incidents.length === 0" class="text-center py-8 text-gray-500">
              <Shield class="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No recent incidents</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Settings class="w-5 h-5 mr-2 text-gray-500" />
            Quick Actions
          </h2>
          
          <div class="grid grid-cols-2 gap-3">
            <ActionButton 
              @click="createIncident"
              icon="AlertTriangle"
              label="Create Incident"
              color="red"
            />
            <ActionButton 
              @click="runDiagnostics"
              icon="Activity"
              label="Run Diagnostics"
              color="blue"
            />
            <ActionButton 
              @click="viewReports"
              icon="BarChart3"
              label="View Reports"
              color="green"
            />
            <ActionButton 
              @click="systemSettings"
              icon="Settings"
              label="Settings"
              color="gray"
            />
          </div>
        </div>
      </div>

      <!-- Quick Access to Intelligent Insights -->
      <div class="mt-6">
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold mb-2">AI/ML Powered Analytics</h3>
              <p class="text-sm opacity-90">Advanced machine learning insights and predictive analysis</p>
            </div>
            <router-link 
              to="/insights" 
              class="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              View Intelligent Insights →
            </router-link>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div class="text-center">
              <p class="text-2xl font-bold">4</p>
              <p class="text-xs opacity-80">Active ML Models</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">12</p>
              <p class="text-xs opacity-80">Anomalies Detected</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">47</p>
              <p class="text-xs opacity-80">Predictions Made</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">89%</p>
              <p class="text-xs opacity-80">Avg Confidence</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-time Monitoring Status -->
      <div class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center">
            <Wifi class="w-5 h-5 mr-2 text-blue-500" />
            Real-time Monitoring Status
          </h3>
          <button
            @click="toggleRealTimeMonitoring"
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              realtimeStatus.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ realtimeStatus.active ? 'Active' : 'Inactive' }}
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div 
            v-for="(status, type) in connectionStatuses" 
            :key="type"
            class="flex items-center space-x-3"
          >
            <div :class="[
              'w-3 h-3 rounded-full',
              status.connected ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <div>
              <p class="text-sm font-medium text-gray-700 capitalize">{{ type }}</p>
              <p class="text-xs text-gray-500">{{ status.type }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Real-time Events -->
        <div class="mt-4 border-t pt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Recent Events</h4>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div 
              v-for="event in realtimeEvents.slice(0, 5)" 
              :key="event.id"
              class="flex items-center justify-between text-sm py-1"
            >
              <div class="flex items-center space-x-2">
                <div :class="getEventColor(event.type)" class="w-2 h-2 rounded-full"></div>
                <span class="text-gray-700">{{ event.message }}</span>
              </div>
              <span class="text-xs text-gray-500">{{ formatTime(event.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Activity,
  RefreshCw,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Users,
  BarChart3
} from 'lucide-vue-next'

// Components
import MetricCard from '@/components/MetricCard.vue'
import PerformanceBar from '@/components/PerformanceBar.vue'
import ActionButton from '@/components/ActionButton.vue'

// Stores
import { useAlertsStore } from '@/stores/alerts'
import { useMetricsStore } from '@/stores/metrics'
import { useIncidentsStore } from '@/stores/incidents'

// Real-time monitoring service
import realtimeService from '@/services/realtimeService'

const router = useRouter()
const alertsStore = useAlertsStore()
const metricsStore = useMetricsStore()
const incidentsStore = useIncidentsStore()

// Reactive data
const isRefreshing = ref(false)
const refreshInterval = ref(null)
const selectedView = ref('aggregate')
const realtimeStatus = ref({ active: false })
const connectionStatuses = ref({})
const realtimeEvents = ref([])
const mlAnalysisResults = ref([])

// Real-time monitoring state
const realtimeConnections = ref({
  alerts: null,
  metrics: null,
  ml: null
})

// Server configurations
const serverConfigs = {
  'aggregate': {
    name: 'All Servers',
    type: 'Aggregate View',
    ip: 'Multiple IPs',
    location: 'Data Center US-East-1'
  },
  'server-01': {
    name: 'WEB-SERVER-01',
    type: 'Web Server',
    ip: '10.0.1.10',
    location: 'Data Center US-East-1'
  },
  'server-02': {
    name: 'DB-SERVER-01',
    type: 'Database Server',
    ip: '10.0.1.20',
    location: 'Data Center US-East-1'
  },
  'server-03': {
    name: 'APP-SERVER-01',
    type: 'Application Server',
    ip: '10.0.1.30',
    location: 'Data Center US-East-2'
  },
  'server-04': {
    name: 'LB-SERVER-01',
    type: 'Load Balancer',
    ip: '10.0.1.5',
    location: 'Data Center US-East-1'
  }
}

// Computed properties
const alerts = computed(() => alertsStore.recentAlerts)
const incidents = computed(() => incidentsStore.recentIncidents)

const metrics = computed(() => ({
  criticalAlerts: alertsStore.criticalCount,
  systemHealth: metricsStore.overallHealth,
  activeIncidents: incidentsStore.activeCount,
  avgLatency: metricsStore.averageLatency,
  alertsTrend: alertsStore.trend,
  healthTrend: metricsStore.healthTrend,
  incidentsTrend: incidentsStore.trend,
  latencyTrend: metricsStore.latencyTrend
}))

const performance = computed(() => {
  // Server-specific performance data
  const serverMetrics = {
    'aggregate': {
      cpu: metricsStore.cpuUsage,
      memory: metricsStore.memoryUsage,
      disk: metricsStore.diskUsage,
      network: metricsStore.networkIO
    },
    'server-01': {
      cpu: 72,
      memory: 68,
      disk: 45,
      network: 32
    },
    'server-02': {
      cpu: 89, // Database server typically higher CPU
      memory: 92, // High memory usage for DB
      disk: 67,
      network: 28
    },
    'server-03': {
      cpu: 56,
      memory: 71,
      disk: 34,
      network: 45
    },
    'server-04': {
      cpu: 23, // Load balancer typically lower
      memory: 34,
      disk: 12,
      network: 85 // High network for LB
    }
  }
  
  return serverMetrics[selectedView.value] || serverMetrics['aggregate']
})

const systemStatus = computed(() => {
  const health = metricsStore.overallHealth
  if (health >= 95) return { color: 'bg-green-500', text: 'Excellent' }
  if (health >= 80) return { color: 'bg-yellow-500', text: 'Good' }
  return { color: 'bg-red-500', text: 'Issues Detected' }
})

// Server-specific computed properties
const selectedServerInfo = computed(() => serverConfigs[selectedView.value])
const selectedServerName = computed(() => selectedServerInfo.value.name)
const currentServerLocation = computed(() => selectedServerInfo.value.location)

const activeServersCount = computed(() => {
  // In real implementation, this would come from actual server health checks
  return selectedView.value === 'aggregate' ? 4 : 1
})

const totalServersCount = computed(() => {
  return selectedView.value === 'aggregate' ? 4 : 1
})

// Methods
const refreshData = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([
      alertsStore.fetchAlerts(),
      metricsStore.fetchMetrics(),
      incidentsStore.fetchIncidents()
    ])
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    isRefreshing.value = false
  }
}

const getSeverityColor = (severity) => {
  const colors = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500'
  }
  return colors[severity] || 'bg-gray-500'
}

const getSeverityTextColor = (severity) => {
  const colors = {
    Critical: 'text-red-700 bg-red-100',
    High: 'text-orange-700 bg-orange-100',
    Medium: 'text-yellow-700 bg-yellow-100',
    Low: 'text-blue-700 bg-blue-100'
  }
  return colors[severity] || 'text-gray-700 bg-gray-100'
}

const getPriorityColor = (priority) => {
  const colors = {
    Critical: 'text-red-700 bg-red-100',
    High: 'text-orange-700 bg-orange-100',
    Medium: 'text-yellow-700 bg-yellow-100',
    Low: 'text-green-700 bg-green-100'
  }
  return colors[priority] || 'text-gray-700 bg-gray-100'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

const updateMetricsView = () => {
  console.log(`Switched to monitoring view: ${selectedView.value} (${selectedServerInfo.value.name})`)
  
  // Restart real-time monitoring with new server filter
  if (realtimeStatus.value.active) {
    stopRealTimeMonitoring()
    startRealTimeMonitoring()
  }
}

const toggleRealTimeMonitoring = () => {
  realtimeStatus.value.active = !realtimeStatus.value.active
  
  if (realtimeStatus.value.active) {
    startRealTimeMonitoring()
  } else {
    stopRealTimeMonitoring()
  }
}

// Real-time monitoring functions
const startRealTimeMonitoring = () => {
  console.log('🚀 Starting real-time monitoring...')
  realtimeStatus.value.active = true
  addRealtimeEvent('info', 'Real-time monitoring activated')
}

const stopRealTimeMonitoring = () => {
  console.log('⏹️ Stopping real-time monitoring...')
  realtimeStatus.value.active = false
  addRealtimeEvent('warning', 'Real-time monitoring deactivated')
}

const getEventColor = (type) => {
  const colors = {
    info: 'bg-blue-500',
    warning: 'bg-orange-500',
    error: 'bg-red-500'
  }
  return colors[type] || 'bg-gray-500'
}

const addRealtimeEvent = (type, message) => {
  const event = {
    id: Date.now() + Math.random(),
    type,
    message,
    timestamp: new Date().toISOString()
  }
  
  realtimeEvents.value.unshift(event)
  
  // Keep only last 50 events
  if (realtimeEvents.value.length > 50) {
    realtimeEvents.value = realtimeEvents.value.slice(0, 50)
  }
}

// Action handlers
const createIncident = () => router.push('/incidents?action=create')
const runDiagnostics = () => router.push('/health?action=diagnostics')
const viewReports = () => router.push('/reports')
const systemSettings = () => router.push('/settings')

// Lifecycle
onMounted(async () => {
  await refreshData()
  
  // Initialize real-time events list
  addRealtimeEvent('info', 'Dashboard initialized')
  
  // Set up periodic refresh every 30 seconds for basic data
  refreshInterval.value = setInterval(refreshData, 30000)
  
  // Auto-start real-time monitoring
  setTimeout(() => {
    startRealTimeMonitoring()
  }, 2000) // Small delay to let the dashboard load first
})

onUnmounted(() => {
  // Clean up intervals
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
  
  // Stop real-time monitoring
  if (realtimeStatus.value.active) {
    stopRealTimeMonitoring()
  }
  
  console.log('Dashboard unmounted - all monitoring stopped')
})

</script>
