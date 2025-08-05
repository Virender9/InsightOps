<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <Brain class="w-7 h-7 text-purple-600" />
          <div>
            <h1 class="text-xl font-bold text-gray-900">Intelligent Insights</h1>
            <p class="text-sm text-gray-500">AI/ML Powered Analytics & Predictions</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <router-link 
            to="/" 
            class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
          >
            <ArrowLeft class="w-4 h-4" />
            <span class="text-sm">Back to Dashboard</span>
          </router-link>
          
          <button
            @click="refreshInsights"
            :disabled="isRefreshing"
            class="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-1"
          >
            <RefreshCw :class="['w-4 h-4', isRefreshing && 'animate-spin']" />
            <span class="text-sm">{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Server Filter Bar -->
    <div class="bg-white border-b border-gray-200 px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700">Analysis Scope:</span>
          <select 
            v-model="selectedServer" 
            @change="updateAnalysisScope"
            class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="aggregate">All Servers (Aggregate Analysis)</option>
            <option value="server-01">WEB-SERVER-01 (Primary)</option>
            <option value="server-02">DB-SERVER-01 (Database)</option>
            <option value="server-03">APP-SERVER-01 (Application)</option>
            <option value="server-04">LB-SERVER-01 (Load Balancer)</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-2 h-2 rounded-full',
              mlEngineStatus ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <span class="text-sm text-gray-600">
              {{ mlEngineStatus ? 'ML Engine Online' : 'ML Engine Offline' }}
            </span>
          </div>
          <div class="text-sm text-gray-500">
            Last Analysis: {{ lastAnalysisTime }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Active ML Models</p>
              <p class="text-2xl font-bold">{{ activeModelsCount }}</p>
            </div>
            <Brain class="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Anomalies Today</p>
              <p class="text-2xl font-bold">{{ anomaliesToday }}</p>
            </div>
            <AlertTriangle class="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Predictions Made</p>
              <p class="text-2xl font-bold">{{ predictionsToday }}</p>
            </div>
            <TrendingUp class="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Avg Confidence</p>
              <p class="text-2xl font-bold">{{ avgConfidence }}%</p>
            </div>
            <CheckCircle class="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      <!-- Main Insights Panel -->
      <IntelligentInsightsPanel :server-filter="selectedServer" />
      
      <!-- Additional Analytics Section -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- ML Performance Metrics -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 class="w-5 h-5 mr-2 text-purple-500" />
            ML Performance Metrics
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Model Accuracy</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full" style="width: 92%"></div>
                </div>
                <span class="text-sm font-medium">92%</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Prediction Speed</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" style="width: 87%"></div>
                </div>
                <span class="text-sm font-medium">87%</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Data Processing</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 95%"></div>
                </div>
                <span class="text-sm font-medium">95%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Insights Summary -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Lightbulb class="w-5 h-5 mr-2 text-yellow-500" />
            Recent Insights Summary
          </h3>
          
          <div class="space-y-3">
            <div class="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">High CPU Correlation Found</p>
                <p class="text-xs text-gray-600">Database and application servers showing synchronized CPU spikes</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Memory Optimization Successful</p>
                <p class="text-xs text-gray-600">Applied ML recommendation reduced memory usage by 23%</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Predictive Alert Triggered</p>
                <p class="text-xs text-gray-600">Disk space will reach critical level in 8 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Brain, 
  ArrowLeft,
  RefreshCw,
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  BarChart3,
  Lightbulb
} from 'lucide-vue-next'

// Components
import IntelligentInsightsPanel from '@/components/IntelligentInsightsPanel.vue'

const router = useRouter()

// Reactive data
const isRefreshing = ref(false)
const selectedServer = ref('aggregate')
const mlEngineStatus = ref(true)
const lastAnalysisTime = ref('2 minutes ago')

// Stats
const activeModelsCount = ref(4)
const anomaliesToday = ref(12)
const predictionsToday = ref(47)
const avgConfidence = ref(89)

// Methods
const refreshInsights = async () => {
  isRefreshing.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    lastAnalysisTime.value = 'Just now'
  } catch (error) {
    console.error('Failed to refresh insights:', error)
  } finally {
    isRefreshing.value = false
  }
}

const updateAnalysisScope = () => {
  console.log(`Analysis scope changed to: ${selectedServer.value}`)
  // In real implementation, this would trigger ML model reanalysis for specific server
}

// Lifecycle
onMounted(() => {
  console.log('Intelligent Insights view mounted')
})
</script>
