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
              <h1 class="text-2xl font-bold">Incident Management</h1>
              <p class="text-sm opacity-90">Real-time Incident Response & Resolution</p>
            </div>
            <div class="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <div class="w-3 h-3 rounded-full animate-pulse bg-white"></div>
              <span class="text-white text-sm font-medium">{{ incidents.length }} Active</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
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

    <!-- Stats Cards -->
    <section class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-red-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Open Incidents</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ statusCounts.open }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-yellow-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Investigating</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ statusCounts.investigating }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-blue-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ statusCounts['in-progress'] || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-green-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Resolved Today</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ resolvedToday }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Incidents List -->
      <div class="bg-white rounded-lg shadow border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Active Incidents</h3>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            v-for="incident in filteredIncidents" 
            :key="incident.id"
            @click="openIncidentDetails(incident)"
            class="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{
              'border-l-4 border-red-500 bg-red-50': incident.priority === 'critical',
              'border-l-4 border-yellow-500 bg-yellow-50': incident.priority === 'high',
              'border-l-4 border-blue-500 bg-blue-50': incident.priority === 'medium'
            }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h4 class="text-lg font-medium text-gray-900">{{ incident.title }}</h4>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(incident.status)
                  ]">
                    {{ incident.status }}
                  </span>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    incident.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    incident.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                    incident.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ incident.priority }} priority
                  </span>
                </div>
                
                <p class="text-gray-600 mb-3">{{ incident.description }}</p>
                
                <div class="flex items-center space-x-6 text-sm text-gray-500">
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ incident.assignee || 'Unassigned' }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ calculateDuration(incident.createdAt) }} ago</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    <span>{{ incident.affectedSystems.length }} systems affected</span>
                  </div>
                </div>
                
                <!-- Affected Systems -->
                <div class="mt-3 flex flex-wrap gap-1">
                  <span 
                    v-for="system in incident.affectedSystems" 
                    :key="system"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ system }}
                  </span>
                </div>
              </div>
              
              <div class="ml-6 flex flex-col items-end space-y-2">
                <div class="text-sm text-gray-500">
                  Created: {{ formatDate(incident.createdAt) }}
                </div>
                <div class="text-sm text-gray-500">
                  Updated: {{ formatDate(incident.updatedAt) }}
                </div>
                <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredIncidents.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No incidents found</h3>
          <p class="mt-1 text-sm text-gray-500">{{ filterStatus ? 'Try adjusting your filters.' : 'All systems are running smoothly.' }}</p>
        </div>
      </div>
    </section>

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
import { AlertTriangle, RefreshCw, Plus } from 'lucide-vue-next'

const incidents = ref([])
const selectedIncident = ref(null)
const isModalOpen = ref(false)
const filterStatus = ref('')

const filteredIncidents = computed(() => {
  if (!filterStatus.value) return incidents.value
  return incidents.value.filter(incident => incident.status === filterStatus.value)
})

const statusCounts = computed(() => {
  const counts = { open: 0, investigating: 0, 'in-progress': 0, resolved: 0 }
  incidents.value.forEach(incident => {
    counts[incident.status] = (counts[incident.status] || 0) + 1
  })
  return counts
})

const resolvedToday = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return incidents.value.filter(incident => {
    const updatedDate = new Date(incident.updatedAt)
    return incident.status === 'resolved' && updatedDate >= today
  }).length
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
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedIncident.value = null
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const calculateDuration = (createdAt) => {
  const now = new Date()
  const created = new Date(createdAt)
  const diffInMs = now - created
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d`
}

const loadIncidents = async () => {
  try {
    const response = await dataService.getIncidents()
    incidents.value = response.data
  } catch (error) {
    console.error('Error loading incidents:', error)
  }
}

const handleIncidentUpdate = (updateData) => {
  const incident = incidents.value.find(inc => inc.id === updateData.id)
  if (incident) {
    Object.assign(incident, updateData)
    console.log('Incident updated:', updateData)
  }
}

const createNewIncident = () => {
  const title = prompt('Enter incident title:')
  if (!title || !title.trim()) return
  
  const description = prompt('Enter incident description:')
  if (!description || !description.trim()) return
  
  const priority = prompt('Enter priority (critical, high, medium, low):') || 'medium'
  
  const newIncident = {
    id: `inc-${Date.now()}`,
    title: title.trim(),
    status: 'open',
    priority: priority.toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: null,
    affectedSystems: [],
    description: description.trim(),
    timeline: [
      {
        timestamp: new Date().toISOString(),
        action: 'Incident created',
        user: 'Current User'
      }
    ]
  }
  
  incidents.value.unshift(newIncident)
  alert('✅ New incident created successfully!')
}

onMounted(() => {
  loadIncidents()
})
</script>
