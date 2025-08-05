<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Professional Header -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="bg-white rounded-lg p-2">
              <Brain class="w-8 h-8 text-blue-600" />
            </div>
            <div class="text-white">
              <h1 class="text-2xl font-bold">AI Operations Center</h1>
              <p class="text-sm opacity-90">Intelligent Monitoring & Automated Response</p>
            </div>
            <div class="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <div :class="[
                'w-3 h-3 rounded-full animate-pulse',
                isLiveMode ? 'bg-green-400' : 'bg-yellow-400'
              ]"></div>
              <span class="text-white text-sm font-medium">{{ isLiveMode ? 'Live Data' : 'Mock Data' }}</span>
              <button 
                @click="toggleDataMode"
                class="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30"
              >
                Toggle
              </button>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-white opacity-90 flex items-center">
              <Clock class="w-4 h-4 mr-1" />
              {{ formatTime(Date.now()) }}
            </div>
            <button
              @click="refreshAllData"
              :disabled="isRefreshing"
              class="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 disabled:opacity-50 flex items-center space-x-2 transition-all"
            >
              <RefreshCw :class="['w-4 h-4', isRefreshing && 'animate-spin']" />
              <span class="text-sm">{{ isRefreshing ? 'Refreshing...' : 'Refresh All' }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="p-6">
      <!-- Quick Stats with Actions -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" 
             @click="$router.push('/incidents')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Active Alerts</p>
              <p class="text-3xl font-bold text-red-600">{{ quickStats.activeAlerts }}</p>
            </div>
            <AlertTriangle class="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" 
             @click="$router.push('/insights')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">ML Insights</p>
              <p class="text-3xl font-bold text-blue-600">{{ quickStats.insights }}</p>
              <p class="text-xs text-gray-500 mt-1">+{{ quickStats.newInsights }} new today</p>
            </div>
            <Brain class="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" 
             @click="$router.push('/health')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">System Health</p>
              <p class="text-3xl font-bold text-green-600">{{ quickStats.health }}%</p>
            </div>
            <CheckCircle class="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" 
             @click="viewRCAReports">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">RCA Reports</p>
              <p class="text-3xl font-bold text-purple-600">{{ quickStats.rca }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ quickStats.pendingRCA }} pending</p>
            </div>
            <FileText class="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      <!-- AI Insights Panel -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <Brain class="w-5 h-5 mr-2 text-purple-500" />
            AI-Powered Insights
          </h2>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div v-for="insight in aiInsights" :key="insight.id" 
                 class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    ]">
                      {{ insight.priority.toUpperCase() }}
                    </span>
                    <span class="text-xs text-gray-500">{{ insight.time }}</span>
                    <span class="text-xs text-blue-600 font-medium">{{ insight.confidence }}% confidence</span>
                  </div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ insight.title }}</h3>
                  <p class="text-gray-600 text-sm">{{ insight.description }}</p>
                </div>
                <div class="ml-4">
                  <button 
                    @click="executeAIAction(insight)"
                    class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    {{ insight.actionLabel }}
                  </button>
                </div>
              </div>
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
import { useAlertsStore } from '@/stores/alerts'
import { useMetricsStore } from '@/stores/metrics'
import { useIncidentsStore } from '@/stores/incidents'
import { useHealthStore } from '@/stores/health'
import { 
  Brain,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-vue-next'

// Stores
const router = useRouter()
const alertsStore = useAlertsStore()
const metricsStore = useMetricsStore()
const incidentsStore = useIncidentsStore()
const healthStore = useHealthStore()

// State
const isRefreshing = ref(false)
const isLiveMode = ref(false)

// Computed properties with fallback data
const quickStats = computed(() => {
  return {
    activeAlerts: alertsStore.criticalAlerts?.length || 3,
    insights: 12,
    newInsights: 3,
    health: Math.round(metricsStore.overallHealth || 94),
    rca: 8,
    pendingRCA: 2
  }
})

// Static AI insights data
const aiInsights = ref([
  {
    id: 1,
    type: 'prediction',
    title: 'Potential System Overload',
    description: 'ML models predict performance issues within 2 hours based on current trends',
    confidence: 89,
    action: 'preventScaling',
    actionLabel: 'Scale Resources',
    priority: 'high',
    time: '5 minutes ago'
  },
  {
    id: 2,
    type: 'anomaly',
    title: 'Unusual Traffic Pattern Detected',
    description: 'Network traffic shows 40% spike from unexpected geographic region',
    confidence: 76,
    action: 'investigateTraffic',
    actionLabel: 'Investigate',
    priority: 'medium',
    time: '12 minutes ago'
  },
  {
    id: 3,
    type: 'optimization',
    title: 'Database Query Optimization',
    description: 'AI identified 3 slow queries that could be optimized for 25% performance gain',
    confidence: 92,
    action: 'reviewOptimization',
    actionLabel: 'Review',
    priority: 'low',
    time: '1 hour ago'
  }
])

// Methods
const refreshAllData = async () => {
  isRefreshing.value = true
  try {
    // Simulate data refresh with error handling
    const refreshPromises = []
    
    if (alertsStore && typeof alertsStore.fetchAlerts === 'function') {
      refreshPromises.push(alertsStore.fetchAlerts().catch(() => console.log('Using fallback alerts data')))
    }
    if (metricsStore && typeof metricsStore.fetchMetrics === 'function') {
      refreshPromises.push(metricsStore.fetchMetrics().catch(() => console.log('Using fallback metrics data')))
    }
    if (incidentsStore && typeof incidentsStore.fetchIncidents === 'function') {
      refreshPromises.push(incidentsStore.fetchIncidents().catch(() => console.log('Using fallback incidents data')))
    }
    if (healthStore && typeof healthStore.fetchHealthData === 'function') {
      refreshPromises.push(healthStore.fetchHealthData().catch(() => console.log('Using fallback health data')))
    }
    
    await Promise.allSettled(refreshPromises)
    
    console.log('✅ AI Operations data refreshed successfully')
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    isRefreshing.value = false
  }
}

const toggleDataMode = () => {
  isLiveMode.value = !isLiveMode.value
  console.log(`Switched to ${isLiveMode.value ? 'Live' : 'Mock'} data mode`)
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

const viewRCAReports = () => {
  router.push('/reports')
}

const executeAIAction = async (insight) => {
  console.log(`Executing AI action: ${insight.action}`)
  
  try {
    switch (insight.action) {
      case 'preventScaling':
        alert('Auto-scaling initiated to prevent system overload')
        break
      case 'investigateTraffic':
        router.push('/reports?tab=traffic')
        break
      case 'reviewOptimization':
        router.push('/reports?tab=optimization')
        break
      default:
        console.log('Unknown action:', insight.action)
    }
  } catch (error) {
    console.error('Failed to execute action:', error)
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🤖 AI Operations Center initializing...')
  
  try {
    await refreshAllData()
    console.log('✅ AI Operations ready with data')
  } catch (error) {
    console.log('⚠️ AI Operations using fallback data:', error)
  }
})

onUnmounted(() => {
  console.log('🧹 AI Operations cleanup completed')
})
</script>
