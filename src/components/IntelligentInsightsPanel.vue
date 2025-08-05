<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center">
        <Brain class="w-5 h-5 mr-2 text-purple-500" />
        Intelligent Insights & ML Analytics
      </h2>
      <div class="flex items-center space-x-2">
        <div :class="[
          'w-2 h-2 rounded-full',
          mlStatus.connected ? 'bg-green-500' : 'bg-red-500'
        ]"></div>
        <span class="text-xs text-gray-500">
          {{ mlStatus.connected ? 'ML Engine Connected' : 'ML Engine Offline' }}
        </span>
      </div>
    </div>

    <!-- ML Analysis Tabs -->
    <div class="border-b border-gray-200 mb-4">
      <nav class="flex space-x-6">
        <button
          v-for="tab in mlTabs"
          :key="tab.id"
          @click="activeMLTab = tab.id"
          :class="[
            'pb-2 border-b-2 font-medium text-sm transition-colors',
            activeMLTab === tab.id
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4 inline mr-1" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Anomaly Detection Tab -->
    <div v-if="activeMLTab === 'anomalies'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Anomaly Score -->
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-700">Anomaly Score</h3>
              <p class="text-2xl font-bold text-purple-600">{{ anomalyScore }}/100</p>
            </div>
            <div class="relative w-12 h-12">
              <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" stroke="currentColor" stroke-width="3" 
                        fill="none" class="text-gray-300"/>
                <circle cx="18" cy="18" r="15" stroke="currentColor" stroke-width="3"
                        fill="none" :stroke-dasharray="`${anomalyScore} 100`"
                        class="text-purple-500"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <AlertTriangle v-if="anomalyScore > 70" class="w-5 h-5 text-red-500" />
                <TrendingUp v-else class="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- ML Confidence -->
        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-700">ML Confidence</h3>
              <p class="text-2xl font-bold text-green-600">{{ mlConfidence }}%</p>
            </div>
            <div class="text-green-500">
              <CheckCircle class="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Anomalies -->
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Detected Anomalies</h3>
        <div 
          v-for="anomaly in recentAnomalies" 
          :key="anomaly.id"
          class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border-l-4"
          :class="getAnomalySeverityClass(anomaly.severity)"
        >
          <component :is="getAnomalyIcon(anomaly.type)" class="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">{{ anomaly.title }}</h4>
              <span :class="getAnomalySeverityTextClass(anomaly.severity)" 
                    class="text-xs px-2 py-1 rounded-full font-medium">
                {{ anomaly.severity }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ anomaly.description }}</p>
            <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>Confidence: {{ anomaly.confidence }}%</span>
              <span>{{ formatTime(anomaly.detected_at) }}</span>
              <span>{{ anomaly.server }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Recommendations Tab -->
    <div v-if="activeMLTab === 'recommendations'" class="space-y-4">
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">AI-Generated Recommendations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Active Recommendations Count -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="bg-blue-500 rounded-lg p-2 mr-3">
                <Lightbulb class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="text-sm text-gray-600">Active Recommendations</p>
                <p class="text-2xl font-bold text-blue-600">{{ activeRecommendations.length }}</p>
              </div>
            </div>
          </div>

          <!-- Auto-Resolution Rate -->
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="bg-green-500 rounded-lg p-2 mr-3">
                <Zap class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="text-sm text-gray-600">Auto-Resolution Rate</p>
                <p class="text-2xl font-bold text-green-600">{{ autoResolutionRate }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations List -->
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <div 
          v-for="recommendation in activeRecommendations" 
          :key="recommendation.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3">
              <div :class="getPriorityColor(recommendation.priority)" class="w-2 h-2 rounded-full mt-2"></div>
              <div>
                <h4 class="font-medium text-gray-900">{{ recommendation.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ recommendation.description }}</p>
                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>ETA: {{ recommendation.estimated_time }}</span>
                  <span>Impact: {{ recommendation.impact_reduction }}% reduction</span>
                  <span>Confidence: {{ recommendation.confidence }}%</span>
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="applyRecommendation(recommendation)"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                @click="dismissRecommendation(recommendation)"
                class="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Predictive Insights Tab -->
    <div v-if="activeMLTab === 'predictions'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Predicted Issues -->
        <div class="bg-yellow-50 rounded-lg p-4 text-center">
          <AlertTriangle class="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p class="text-sm text-gray-600">Predicted Issues</p>
          <p class="text-2xl font-bold text-yellow-600">{{ predictedIssues.length }}</p>
        </div>

        <!-- Risk Score -->
        <div class="bg-red-50 rounded-lg p-4 text-center">
          <Shield class="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p class="text-sm text-gray-600">Risk Score</p>
          <p class="text-2xl font-bold text-red-600">{{ riskScore }}/100</p>
        </div>

        <!-- Forecast Accuracy -->
        <div class="bg-purple-50 rounded-lg p-4 text-center">
          <CheckCircle class="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p class="text-sm text-gray-600">Forecast Accuracy</p>
          <p class="text-2xl font-bold text-purple-600">{{ forecastAccuracy }}%</p>
        </div>
      </div>

      <!-- Predicted Issues List -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-gray-700">Predicted Issues (Next 24h)</h3>
        <div 
          v-for="prediction in predictedIssues" 
          :key="prediction.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900">{{ prediction.title }}</h4>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500">{{ prediction.probability }}% probability</span>
              <span :class="getTimeCriticality(prediction.estimated_occurrence)" 
                    class="text-xs px-2 py-1 rounded-full">
                {{ prediction.estimated_occurrence }}
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-2">{{ prediction.description }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>Impact: {{ prediction.potential_impact }}</span>
            <span>Preventive Action Available: {{ prediction.preventable ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ML Models Status Tab -->
    <div v-if="activeMLTab === 'models'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="model in mlModels" 
          :key="model.name"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-900">{{ model.name }}</h4>
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              model.status === 'active' ? 'bg-green-100 text-green-800' :
              model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            ]">
              {{ model.status }}
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Accuracy:</span>
              <span class="font-medium">{{ model.accuracy }}%</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Last Updated:</span>
              <span class="font-medium">{{ model.last_updated }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Predictions Today:</span>
              <span class="font-medium">{{ model.predictions_today }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  Lightbulb, 
  Zap,
  Shield,
  Cpu,
  Activity,
  BarChart3,
  Eye
} from 'lucide-vue-next'

// Props
const props = defineProps({
  serverFilter: {
    type: String,
    default: 'aggregate'
  }
})

// Reactive data
const activeMLTab = ref('anomalies')
const mlStatus = ref({ connected: true })
const anomalyScore = ref(23)
const mlConfidence = ref(92)
const autoResolutionRate = ref(76)
const riskScore = ref(34)
const forecastAccuracy = ref(88)

// ML Tabs configuration
const mlTabs = [
  { id: 'anomalies', name: 'Anomaly Detection', icon: 'AlertTriangle' },
  { id: 'recommendations', name: 'AI Recommendations', icon: 'Lightbulb' },
  { id: 'predictions', name: 'Predictive Insights', icon: 'TrendingUp' },
  { id: 'models', name: 'ML Models', icon: 'Brain' }
]

// Mock data - in real implementation, this would come from ML backend
const recentAnomalies = ref([
  {
    id: '1',
    type: 'cpu_spike',
    title: 'CPU Spike Anomaly Detected',
    description: 'Unusual CPU usage pattern detected on DB-SERVER-01, 40% above baseline',
    severity: 'high',
    confidence: 94,
    detected_at: new Date(Date.now() - 300000).toISOString(),
    server: 'DB-SERVER-01'
  },
  {
    id: '2',
    type: 'memory_leak',
    title: 'Potential Memory Leak',
    description: 'Memory usage showing continuous upward trend without corresponding load increase',
    severity: 'medium',
    confidence: 87,
    detected_at: new Date(Date.now() - 900000).toISOString(),
    server: 'APP-SERVER-01'
  },
  {
    id: '3',
    type: 'network_anomaly',
    title: 'Network Traffic Anomaly',
    description: 'Unusual network pattern suggests possible security issue or data exfiltration',
    severity: 'critical',
    confidence: 91,
    detected_at: new Date(Date.now() - 1200000).toISOString(),
    server: 'WEB-SERVER-01'
  }
])

const activeRecommendations = ref([
  {
    id: '1',
    title: 'Scale Database Server',
    description: 'Add additional DB replicas to handle increased load and prevent CPU bottlenecks',
    priority: 'high',
    estimated_time: '10-15 minutes',
    impact_reduction: 65,
    confidence: 89
  },
  {
    id: '2',
    title: 'Restart Application Service',
    description: 'Clear memory leak by restarting the application service during low-traffic window',
    priority: 'medium',
    estimated_time: '2-3 minutes',
    impact_reduction: 45,
    confidence: 76
  },
  {
    id: '3',
    title: 'Update Firewall Rules',
    description: 'Block suspicious IP ranges detected by network anomaly analysis',
    priority: 'critical',
    estimated_time: '1 minute',
    impact_reduction: 90,
    confidence: 95
  }
])

const predictedIssues = ref([
  {
    id: '1',
    title: 'Database Connection Pool Exhaustion',
    description: 'Based on current trends, connection pool will be exhausted in 4-6 hours',
    probability: 78,
    estimated_occurrence: 'In 4-6 hours',
    potential_impact: 'Service disruption for 10-30 minutes',
    preventable: true
  },
  {
    id: '2',
    title: 'Disk Space Critical on Log Server',
    description: 'Log partition will reach 95% capacity based on current growth rate',
    probability: 92,
    estimated_occurrence: 'In 2-3 hours',
    potential_impact: 'Log ingestion will stop, monitoring gaps',
    preventable: true
  },
  {
    id: '3',
    title: 'SSL Certificate Expiration',
    description: 'Production SSL certificate expires soon, may cause service interruption',
    probability: 100,
    estimated_occurrence: 'In 18 hours',
    potential_impact: 'Complete service outage until renewal',
    preventable: true
  }
])

const mlModels = ref([
  {
    name: 'Anomaly Detection (Isolation Forest)',
    status: 'active',
    accuracy: 94,
    last_updated: '2 hours ago',
    predictions_today: 847
  },
  {
    name: 'LSTM Autoencoder (Time Series)',
    status: 'active',
    accuracy: 89,
    last_updated: '6 hours ago',
    predictions_today: 234
  },
  {
    name: 'Z-Score Statistical Model',
    status: 'training',
    accuracy: 76,
    last_updated: '1 day ago',
    predictions_today: 156
  },
  {
    name: 'Predictive Maintenance Model',
    status: 'active',
    accuracy: 91,
    last_updated: '4 hours ago',
    predictions_today: 45
  }
])

// Methods
const getAnomalySeverityClass = (severity) => {
  const classes = {
    'critical': 'border-red-500',
    'high': 'border-orange-500',
    'medium': 'border-yellow-500',
    'low': 'border-blue-500'
  }
  return classes[severity] || 'border-gray-300'
}

const getAnomalySeverityTextClass = (severity) => {
  const classes = {
    'critical': 'bg-red-100 text-red-800',
    'high': 'bg-orange-100 text-orange-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-blue-100 text-blue-800'
  }
  return classes[severity] || 'bg-gray-100 text-gray-800'
}

const getAnomalyIcon = (type) => {
  const icons = {
    'cpu_spike': 'Cpu',
    'memory_leak': 'Activity',
    'network_anomaly': 'BarChart3',
    'disk_usage': 'Shield'
  }
  return icons[type] || 'AlertTriangle'
}

const getPriorityColor = (priority) => {
  const colors = {
    'critical': 'bg-red-500',
    'high': 'bg-orange-500',
    'medium': 'bg-yellow-500',
    'low': 'bg-green-500'
  }
  return colors[priority] || 'bg-gray-500'
}

const getTimeCriticality = (time) => {
  if (time.includes('hour')) {
    const hours = parseInt(time.match(/\d+/)[0])
    if (hours <= 2) return 'bg-red-100 text-red-800'
    if (hours <= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }
  return 'bg-blue-100 text-blue-800'
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

const applyRecommendation = (recommendation) => {
  console.log('Applying recommendation:', recommendation.title)
  // In real implementation, this would trigger automation scripts
}

const dismissRecommendation = (recommendation) => {
  const index = activeRecommendations.value.findIndex(r => r.id === recommendation.id)
  if (index !== -1) {
    activeRecommendations.value.splice(index, 1)
  }
}

// Real-time updates simulation
let updateInterval = null

onMounted(() => {
  // Simulate real-time updates
  updateInterval = setInterval(() => {
    // Update anomaly score
    anomalyScore.value = Math.max(15, Math.min(85, anomalyScore.value + (Math.random() - 0.5) * 10))
    
    // Update ML confidence
    mlConfidence.value = Math.max(80, Math.min(98, mlConfidence.value + (Math.random() - 0.5) * 5))
  }, 30000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>
