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
          
          <!-- Simple performance indicators -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-lg font-bold text-green-600">{{ healthData.uptime || '99.9' }}%</div>
              <div class="text-xs text-gray-500">Uptime</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-lg font-bold text-blue-600">{{ healthData.throughput || '1.2k' }}</div>
              <div class="text-xs text-gray-500">Req/min</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-lg font-bold text-purple-600">{{ healthData.errors || '0.01' }}%</div>
              <div class="text-xs text-gray-500">Error Rate</div>
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

const responseTimeHistory = ref([
  { timestamp: new Date(Date.now() - 3600000).toISOString(), responseTime: 120 },
  { timestamp: new Date(Date.now() - 1800000).toISOString(), responseTime: 135 },
  { timestamp: new Date(Date.now() - 900000).toISOString(), responseTime: 152 },
  { timestamp: new Date().toISOString(), responseTime: 145 }
])

const services = ref([
  {
    name: 'Web Frontend',
    description: 'React Application',
    status: 'healthy',
    responseTime: 89,
    lastCheck: '1 min ago'
  },
  {
    name: 'API Gateway',
    description: 'REST API Service',
    status: 'healthy',
    responseTime: 156,
    lastCheck: '1 min ago'
  },
  {
    name: 'Database',
    description: 'PostgreSQL Primary',
    status: 'warning',
    responseTime: 234,
    lastCheck: '2 min ago'
  },
  {
    name: 'Cache Service',
    description: 'Redis Cluster',
    status: 'healthy',
    responseTime: 12,
    lastCheck: '30 sec ago'
  },
  {
    name: 'Message Queue',
    description: 'RabbitMQ',
    status: 'healthy',
    responseTime: 45,
    lastCheck: '1 min ago'
  },
  {
    name: 'File Storage',
    description: 'AWS S3',
    status: 'critical',
    responseTime: 567,
    lastCheck: '5 min ago'
  }
])

// Computed
const overallHealth = computed(() => {
  const criticalServices = services.value.filter(s => s.status === 'critical').length
  const warningServices = services.value.filter(s => s.status === 'warning').length
  
  if (criticalServices > 0) return 'critical'
  if (warningServices > 0) return 'warning'
  return 'healthy'
})

// Methods
const refreshData = async () => {
  isRefreshing.value = true
  
  // Simulate data refresh
  setTimeout(() => {
    systemMetrics.cpu = Math.floor(Math.random() * 100)
    systemMetrics.memory = Math.floor(Math.random() * 100)
    systemMetrics.responseTime = Math.floor(Math.random() * 300) + 100
    lastUpdated.value = new Date().toLocaleTimeString()
    isRefreshing.value = false
  }, 1000)
}

// Lifecycle
onMounted(() => {
  // Auto-refresh every 30 seconds
  setInterval(() => {
    if (!isRefreshing.value) {
      refreshData()
    }
  }, 30000)
});

const getTrendColor = (trend) => {
  switch(trend) {
    case 'optimal': return 'text-green-600';
    case 'degrading': return 'text-red-600';
    default: return 'text-blue-600';
  }
};

const getTrendIcon = (trend) => {
  switch(trend) {
    case 'optimal': return 'text-green-500';
    case 'degrading': return 'text-red-500';
    default: return 'text-blue-500';
  }
};
</script>
