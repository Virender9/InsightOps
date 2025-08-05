<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Professional Header -->
    <header class="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="bg-white rounded-lg p-2">
              <Activity class="w-8 h-8 text-green-600" />
            </div>
            <div class="text-white">
              <h1 class="text-2xl font-bold">System Health Monitor</h1>
              <p class="text-sm opacity-90">Real-time Infrastructure Monitoring</p>
            </div>
            <div class="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <div :class="[
                'w-3 h-3 rounded-full animate-pulse',
                healthStatus === 'excellent' ? 'bg-green-400' :
                healthStatus === 'good' ? 'bg-yellow-400' :
                healthStatus === 'warning' ? 'bg-orange-400' : 'bg-red-400'
              ]"></div>
              <span class="text-white text-sm font-medium">{{ healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1) }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-white opacity-90">
              <Clock class="w-4 h-4 inline mr-1" />
              {{ formatTimestamp(lastUpdated) }}
            </div>
            <button 
              @click="refreshAllData"
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

    <!-- Main Content -->
    <main class="p-6 space-y-8">
      <!-- System Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Health Overview Card -->
        <div v-for="metric in systemMetrics" :key="metric.id" 
             class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div :class="[
              'p-3 rounded-lg',
              `bg-${metric.color}-100`
            ]">
              <component :is="metric.icon" :class="['w-6 h-6', `text-${metric.color}-600`]" />
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ metric.value }}{{ metric.unit }}</div>
              <div :class="[
                'text-xs font-medium flex items-center justify-end mt-1',
                metric.trend === 'up' ? 'text-red-600' : 
                metric.trend === 'down' ? 'text-green-600' : 'text-gray-500'
              ]">
                <TrendingUp v-if="metric.trend === 'up'" class="w-3 h-3 mr-1" />
                <TrendingDown v-else-if="metric.trend === 'down'" class="w-3 h-3 mr-1" />
                <Minus v-else class="w-3 h-3 mr-1" />
                {{ metric.change }}%
              </div>
            </div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900 mb-1">{{ metric.label }}</div>
            <div class="text-xs text-gray-500">{{ metric.description }}</div>
            
            <!-- Progress bar -->
            <div class="mt-3">
              <div class="bg-gray-200 rounded-full h-2">
                <div 
                  :class="[
                    'h-2 rounded-full transition-all duration-500',
                    `bg-${metric.color}-500`
                  ]"
                  :style="{ width: `${Math.min(metric.rawValue, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-xs text-gray-500">{{ metric.status }}</span>
                <span class="text-xs font-medium text-gray-700">{{ metric.threshold }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Health Status Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- System Performance Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 class="w-5 h-5 mr-2 text-blue-600" />
              Performance Trends
            </h3>
            <div class="text-sm text-gray-500">Last 24 hours</div>
          </div>
          
          <!-- Performance trends with indicators -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <!-- Uptime Trend -->
            <div class="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 min-h-0">
              <div class="flex flex-col items-center space-y-1">
                <div class="text-lg font-bold text-green-700 truncate">{{ healthData.uptime || '99.9' }}%</div>
                <div class="flex items-center text-green-600">
                  <TrendingUp class="w-3 h-3 flex-shrink-0" />
                  <span class="text-xs font-medium ml-1">+0.1%</span>
                </div>
              </div>
              <div class="text-center mt-2">
                <div class="text-xs font-medium text-green-600">Uptime</div>
                <div class="text-xs text-green-500">vs last week</div>
              </div>
              
              <!-- Mini trend line -->
              <div class="mt-3 h-6 flex items-end justify-center space-x-px">
                <div class="w-1 bg-green-300 rounded-full" style="height: 60%"></div>
                <div class="w-1 bg-green-400 rounded-full" style="height: 70%"></div>
                <div class="w-1 bg-green-400 rounded-full" style="height: 65%"></div>
                <div class="w-1 bg-green-500 rounded-full" style="height: 85%"></div>
                <div class="w-1 bg-green-600 rounded-full" style="height: 100%"></div>
              </div>
            </div>
            
            <!-- Throughput Trend -->
            <div class="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 min-h-0">
              <div class="flex flex-col items-center space-y-1">
                <div class="text-lg font-bold text-blue-700 truncate">{{ healthData.throughput || '1.2k' }}</div>
                <div class="flex items-center text-blue-600">
                  <TrendingUp class="w-3 h-3 flex-shrink-0" />
                  <span class="text-xs font-medium ml-1">+15%</span>
                </div>
              </div>
              <div class="text-center mt-2">
                <div class="text-xs font-medium text-blue-600">Req/min</div>
                <div class="text-xs text-blue-500">vs last hour</div>
              </div>
              
              <!-- Mini trend line -->
              <div class="mt-3 h-6 flex items-end justify-center space-x-px">
                <div class="w-1 bg-blue-300 rounded-full" style="height: 40%"></div>
                <div class="w-1 bg-blue-400 rounded-full" style="height: 55%"></div>
                <div class="w-1 bg-blue-400 rounded-full" style="height: 70%"></div>
                <div class="w-1 bg-blue-500 rounded-full" style="height: 85%"></div>
                <div class="w-1 bg-blue-600 rounded-full" style="height: 100%"></div>
              </div>
            </div>
            
            <!-- Error Rate Trend -->
            <div class="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 min-h-0">
              <div class="flex flex-col items-center space-y-1">
                <div class="text-lg font-bold text-purple-700 truncate">{{ healthData.errors || '0.01' }}%</div>
                <div class="flex items-center text-green-600">
                  <TrendingDown class="w-3 h-3 flex-shrink-0" />
                  <span class="text-xs font-medium ml-1">-0.05%</span>
                </div>
              </div>
              <div class="text-center mt-2">
                <div class="text-xs font-medium text-purple-600">Error Rate</div>
                <div class="text-xs text-purple-500">vs yesterday</div>
              </div>
              
              <!-- Mini trend line -->
              <div class="mt-3 h-6 flex items-end justify-center space-x-px">
                <div class="w-1 bg-red-400 rounded-full" style="height: 100%"></div>
                <div class="w-1 bg-yellow-400 rounded-full" style="height: 70%"></div>
                <div class="w-1 bg-yellow-300 rounded-full" style="height: 50%"></div>
                <div class="w-1 bg-green-400 rounded-full" style="height: 30%"></div>
                <div class="w-1 bg-green-500 rounded-full" style="height: 20%"></div>
              </div>
            </div>
          </div>
          
          <!-- Additional trend insights -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-700 mb-2">Key Insights</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-gray-600">System stability improved by 12% this week</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-gray-600">Peak traffic: 2.1k req/min at 2:30 PM</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-gray-600">Error rate below target (< 0.1%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span class="text-gray-600">Next maintenance: {{ nextMaintenance }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Service Status -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Server class="w-5 h-5 mr-2 text-green-600" />
              Service Status
            </h3>
            <span class="text-sm text-green-600 font-medium">All Operational</span>
          </div>
          
          <!-- Services list -->
          <div class="space-y-3">
            <div v-for="service in services" :key="service.name" class="flex items-center justify-between py-2">
              <div class="flex items-center space-x-3">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  service.status === 'operational' ? 'bg-green-500' :
                  service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                ]"></div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
                  <div class="text-xs text-gray-500">{{ service.description }}</div>
                </div>
              </div>
              <div class="text-xs font-medium" :class="[
                service.status === 'operational' ? 'text-green-600' :
                service.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
              ]">
                {{ service.status.charAt(0).toUpperCase() + service.status.slice(1) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHealthStore } from '@/stores/health'
import {
  Activity,
  RefreshCw,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Zap,
  BarChart3,
  Server,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-vue-next'

// Store integration
const healthStore = useHealthStore()

// State
const isRefreshing = ref(false)
let refreshInterval = null

// Computed properties
const healthData = computed(() => healthStore.healthData || {})
const lastUpdated = computed(() => healthStore.lastUpdated || Date.now())

const healthStatus = computed(() => {
  const overallHealth = healthStore.overallHealth || 94
  if (overallHealth >= 95) return 'excellent'
  if (overallHealth >= 85) return 'good'
  if (overallHealth >= 70) return 'warning'
  return 'critical'
})

const nextMaintenance = computed(() => {
  const future = new Date()
  future.setDate(future.getDate() + 7) // Next week
  return future.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// System metrics with modern structure
const systemMetrics = computed(() => [
  {
    id: 'cpu',
    label: 'CPU Usage',
    description: 'Current processor utilization',
    value: healthData.value.cpu || '67.8',
    unit: '%',
    rawValue: parseInt(healthData.value.cpu) || 68,
    icon: Cpu,
    color: 'blue',
    trend: 'up',
    change: '2.3',
    status: 'Normal',
    threshold: 'Max: 80%'
  },
  {
    id: 'memory',
    label: 'Memory Usage',
    description: 'RAM utilization across servers',
    value: healthData.value.memory || '78.9',
    unit: '%',
    rawValue: parseInt(healthData.value.memory) || 79,
    icon: Database,
    color: 'green',
    trend: 'up',
    change: '5.2',
    status: 'Warning',
    threshold: 'Max: 85%'
  },
  {
    id: 'response',
    label: 'Response Time',
    description: 'Average API response latency',
    value: healthData.value.responseTime || '145',
    unit: 'ms',
    rawValue: 35, // for progress bar
    icon: Clock,
    color: 'yellow',
    trend: 'up',
    change: '12',
    status: 'Good',
    threshold: 'Max: 200ms'
  },
  {
    id: 'uptime',
    label: 'System Uptime',
    description: 'Overall system availability',
    value: healthData.value.uptime || '99.7',
    unit: '%',
    rawValue: 99.7,
    icon: Zap,
    color: 'purple',
    trend: 'stable',
    change: '0.0',
    status: 'Excellent',
    threshold: 'Target: 99.9%'
  }
])

// Service status list
const services = computed(() => [
  {
    name: 'Web Server',
    description: 'Nginx load balancer',
    status: 'operational'
  },
  {
    name: 'Database Cluster',
    description: 'PostgreSQL primary/replica',
    status: 'operational'
  },
  {
    name: 'Redis Cache',
    description: 'In-memory data store',
    status: 'degraded'
  },
  {
    name: 'Message Queue',
    description: 'RabbitMQ broker',
    status: 'operational'
  },
  {
    name: 'API Gateway',
    description: 'Kong API management',
    status: 'operational'
  }
])

// Methods
const refreshAllData = async () => {
  isRefreshing.value = true
  try {
    // Check if method exists before calling
    if (healthStore && typeof healthStore.fetchHealthData === 'function') {
      await healthStore.fetchHealthData()
      console.log('✅ Health data refreshed successfully')
    } else {
      console.log('⚠️ Health store method not available, using static data')
    }
  } catch (error) {
    console.error('Failed to refresh health data:', error)
  } finally {
    isRefreshing.value = false
  }
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const startAutoRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval)
  
  refreshInterval = setInterval(() => {
    if (!isRefreshing.value) {
      refreshAllData()
    }
  }, 30000) // Refresh every 30 seconds
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🏥 Health Monitor initialized')
  
  try {
    // Load initial data
    await refreshAllData()
    
    // Start auto-refresh
    startAutoRefresh()
    
  } catch (error) {
    console.error('Failed to initialize health monitor:', error)
  }
})

onUnmounted(() => {
  // Cleanup intervals
  stopAutoRefresh()
  
  // Cleanup store resources
  healthStore.destroy()
  
  console.log('🧹 Health Monitor cleanup completed')
})
</script>
