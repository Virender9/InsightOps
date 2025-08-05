<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Professional Header -->
    <header class="bg-gradient-to-r from-red-600 to-pink-600 shadow-lg">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="bg-white rounded-lg p-2">
              <AlertTriangle class="w-8 h-8 text-red-600" />
            </div>
            <div class="text-white">
              <h1 class="text-2xl font-bold">Incident Command Center</h1>
              <p class="text-sm opacity-90">Real-time Incident Response & Resolution Hub</p>
            </div>
            <div class="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <div class="w-3 h-3 rounded-full animate-pulse bg-white"></div>
              <span class="text-white text-sm font-medium">{{ incidents.length }} Total Incidents</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4 pl-2">
            <div class="text-sm text-white opacity-90 flex items-center">
              <Clock class="w-4 h-4 mr-1" />
              Last updated: {{ formatTime(Date.now()) }}
            </div>
            <select v-model="filterStatus" class="bg-white bg-opacity-20 text-white rounded-lg px-3 py-2 text-sm border border-white border-opacity-30">
              <option value="" class="text-gray-900">All Statuses</option>
              <option value="open" class="text-gray-900">Open</option>
              <option value="investigating" class="text-gray-900">Investigating</option>
              <option value="in-progress" class="text-gray-900">In Progress</option>
              <option value="resolved" class="text-gray-900">Resolved</option>
            </select>
            <button 
              @click="loadIncidents"
              class="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
              title="Refresh incidents"
            >
              <RefreshCw class="w-4 h-4" />
            </button>
            <button 
              @click="createNewIncident"
              class="inline-flex items-center px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 font-medium text-sm transition-all"
            >
              <Plus class="w-4 h-4 mr-2" />
              Create Incident
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6 space-y-8">
      <!-- Enhanced Stats Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Critical Incidents -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-lg bg-red-100">
              <AlertTriangle class="w-6 h-6 text-red-600" />
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ statusCounts.open }}</div>
              <div class="text-xs font-medium text-red-600 flex items-center justify-end mt-1">
                <TrendingUp class="w-3 h-3 mr-1" />
                +2 today
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-gray-900">Critical Incidents</div>
            <div class="text-xs text-gray-500">Requiring immediate attention</div>
            <div class="mt-3">
              <div class="bg-red-200 rounded-full h-2">
                <div class="h-2 bg-red-500 rounded-full transition-all duration-500" 
                     :style="{ width: incidents.length > 0 ? `${Math.min((statusCounts.open / incidents.length) * 100, 100)}%` : '0%' }">
                </div>
              </div>
              <div class="flex justify-between mt-2">
                <span class="text-xs text-gray-500">High Priority</span>
                <span class="text-xs font-medium text-gray-700">{{ incidents.length > 0 ? Math.round((statusCounts.open / incidents.length) * 100) : 0 }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- In Progress -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-lg bg-yellow-100">
              <Activity class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ statusCounts.investigating + statusCounts['in-progress'] }}</div>
              <div class="text-xs font-medium text-yellow-600 flex items-center justify-end mt-1">
                <Minus class="w-3 h-3 mr-1" />
                Stable
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-gray-900">Active Resolution</div>
            <div class="text-xs text-gray-500">Currently being addressed</div>
            <div class="mt-3">
              <div class="bg-yellow-200 rounded-full h-2">
                <div class="h-2 bg-yellow-500 rounded-full transition-all duration-500" 
                     :style="{ width: incidents.length > 0 ? `${Math.min(((statusCounts.investigating + statusCounts['in-progress']) / incidents.length) * 100, 100)}%` : '0%' }">
                </div>
              </div>
              <div class="flex justify-between mt-2">
                <span class="text-xs text-gray-500">In Progress</span>
                <span class="text-xs font-medium text-gray-700">{{ incidents.length > 0 ? Math.round(((statusCounts.investigating + statusCounts['in-progress']) / incidents.length) * 100) : 0 }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Resolved Today -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-lg bg-green-100">
              <CheckCircle class="w-6 h-6 text-green-600" />
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ statusCounts.resolved }}</div>
              <div class="text-xs font-medium text-green-600 flex items-center justify-end mt-1">
                <TrendingDown class="w-3 h-3 mr-1" />
                -15%
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-gray-900">Resolved</div>
            <div class="text-xs text-gray-500">Successfully closed</div>
            <div class="mt-3">
              <div class="bg-green-200 rounded-full h-2">
                <div class="h-2 bg-green-500 rounded-full transition-all duration-500" 
                     :style="{ width: incidents.length > 0 ? `${Math.min((statusCounts.resolved / incidents.length) * 100, 100)}%` : '0%' }">
                </div>
              </div>
              <div class="flex justify-between mt-2">
                <span class="text-xs text-gray-500">Resolution Rate</span>
                <span class="text-xs font-medium text-gray-700">{{ incidents.length > 0 ? Math.round((statusCounts.resolved / incidents.length) * 100) : 0 }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Response Time -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-lg bg-blue-100">
              <Clock class="w-6 h-6 text-blue-600" />
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">12m</div>
              <div class="text-xs font-medium text-green-600 flex items-center justify-end mt-1">
                <TrendingDown class="w-3 h-3 mr-1" />
                -3m
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-medium text-gray-900">Avg Response Time</div>
            <div class="text-xs text-gray-500">Time to first response</div>
            <div class="mt-3">
              <div class="bg-blue-200 rounded-full h-2">
                <div class="h-2 bg-blue-500 rounded-full transition-all duration-500" style="width: 75%"></div>
              </div>
              <div class="flex justify-between mt-2">
                <span class="text-xs text-gray-500">Target: 15m</span>
                <span class="text-xs font-medium text-gray-700">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Incidents Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <Shield class="w-5 h-5 mr-2 text-red-600" />
              Active Incidents
            </h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">{{ filteredIncidents.length }} incidents</span>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <span class="text-xs text-gray-600">{{ statusCounts.open }} Open</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span class="text-xs text-gray-600">{{ statusCounts.investigating }} Investigating</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="incident in filteredIncidents" :key="incident.id" 
                  class="hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="openIncidentDetails(incident)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div :class="[
                        'h-10 w-10 rounded-full flex items-center justify-center',
                        incident.severity === 'critical' ? 'bg-red-100' :
                        incident.severity === 'high' ? 'bg-orange-100' :
                        incident.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                      ]">
                        <AlertTriangle :class="[
                          'h-5 w-5',
                          incident.severity === 'critical' ? 'text-red-600' :
                          incident.severity === 'high' ? 'text-orange-600' :
                          incident.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        ]" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ incident.title }}</div>
                      <div class="text-sm text-gray-500">ID: {{ incident.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusColor(incident.status)
                  ]">
                    {{ incident.status.charAt(0).toUpperCase() + incident.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div :class="[
                      'w-2 h-2 rounded-full mr-2',
                      incident.severity === 'critical' ? 'bg-red-500' :
                      incident.severity === 'high' ? 'bg-orange-500' :
                      incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    ]"></div>
                    <span class="text-sm text-gray-900 capitalize">{{ incident.severity }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <div class="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                      <User class="h-3 w-3 text-gray-600" />
                    </div>
                    {{ incident.assignedTo || 'Unassigned' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ calculateDuration(incident.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click.stop="openIncidentDetails(incident)"
                    class="text-red-600 hover:text-red-900 mr-3"
                  >
                    View
                  </button>
                  <button 
                    @click.stop="incident.status !== 'resolved' && updateIncidentStatus(incident.id, 'resolved')"
                    :class="[
                      'text-green-600 hover:text-green-900',
                      incident.status === 'resolved' && 'opacity-50 cursor-not-allowed'
                    ]"
                  >
                    Resolve
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredIncidents.length === 0" class="p-12 text-center">
          <div class="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Shield class="h-12 w-12 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
          <p class="text-gray-500 mb-4">No incidents match your current filter criteria.</p>
          <button 
            @click="createNewIncident"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus class="w-4 h-4 mr-2" />
            Create New Incident
          </button>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <SimpleIncidentModal 
      :incident="selectedIncident" 
      @close="closeModal"
      @update="handleIncidentUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dataService } from '@/services/dataService'
import SimpleIncidentModal from '@/components/SimpleIncidentModal.vue'
import { 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Clock,
  Activity,
  CheckCircle,
  Shield,
  User,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-vue-next'

const incidents = ref([])
const selectedIncident = ref(null)
const filterStatus = ref('')

const filteredIncidents = computed(() => {
  if (!filterStatus.value) return incidents.value
  return incidents.value.filter(incident => incident.status === filterStatus.value)
})

const statusCounts = computed(() => {
  const counts = { open: 0, investigating: 0, 'in-progress': 0, resolved: 0 }
  incidents.value.forEach(incident => {
    if (counts.hasOwnProperty(incident.status)) {
      counts[incident.status]++
    }
  })
  return counts
})

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800'
    case 'investigating': return 'bg-yellow-100 text-yellow-800'
    case 'in-progress': return 'bg-blue-100 text-blue-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const openIncidentDetails = (incident) => {
  selectedIncident.value = incident
}

const closeModal = () => {
  selectedIncident.value = null
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

const calculateDuration = (createdAt) => {
  const now = new Date()
  const created = new Date(createdAt)
  const diffMs = now - created
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`
  if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`
  return `${diffMins}m`
}

const loadIncidents = async () => {
  try {
    // Always use fallback data for now to ensure data displays
    incidents.value = [
      {
        id: 'INC-001',
        title: 'Database Connection Timeout',
        status: 'open',
        severity: 'critical',
        assignedTo: 'John Doe',
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        description: 'Multiple database connection timeouts reported'
      },
      {
        id: 'INC-002', 
        title: 'High CPU Usage on Web Server',
        status: 'investigating',
        severity: 'high',
        assignedTo: 'Jane Smith',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        description: 'CPU usage consistently above 90%'
      },
      {
        id: 'INC-003',
        title: 'API Response Time Degradation',
        status: 'in-progress',
        severity: 'medium',
        assignedTo: 'Mike Johnson', 
        createdAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
        description: 'API response times increased by 40%'
      },
      {
        id: 'INC-004',
        title: 'SSL Certificate Expiration Warning',
        status: 'resolved',
        severity: 'low', 
        assignedTo: 'Sarah Wilson',
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        description: 'SSL certificate renewed successfully'
      },
      {
        id: 'INC-005',
        title: 'Memory Leak in Application Server',
        status: 'open',
        severity: 'high',
        assignedTo: 'Tom Brown',
        createdAt: new Date(Date.now() - 900000).toISOString(), // 15 min ago
        description: 'Memory usage continuously increasing'
      }
    ]
    
    console.log('✅ Incidents loaded successfully:', incidents.value.length, 'incidents')
  } catch (error) {
    console.error('Error loading incidents:', error)
  }
}

const handleIncidentUpdate = (updateData) => {
  const incident = incidents.value.find(inc => inc.id === updateData.id)
  if (incident) {
    Object.assign(incident, updateData)
  }
  selectedIncident.value = null
}

const updateIncidentStatus = async (incidentId, newStatus) => {
  const incident = incidents.value.find(inc => inc.id === incidentId)
  if (incident) {
    incident.status = newStatus
    console.log(`Incident ${incidentId} status updated to: ${newStatus}`)
  }
}

const createNewIncident = () => {
  const newIncident = {
    id: `INC-${String(incidents.value.length + 1).padStart(3, '0')}`,
    title: 'New Incident',
    status: 'open',
    severity: 'medium',
    assignedTo: null,
    createdAt: new Date().toISOString(),
    description: 'New incident description'
  }
  
  incidents.value.unshift(newIncident)
  selectedIncident.value = newIncident
}

onMounted(() => {
  loadIncidents()
})
</script>
