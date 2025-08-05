<template>
  <div v-if="incident" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Incident Details</h2>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Incident Overview -->
        <div class="border rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ incident.title }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Status</label>
              <div class="mt-1">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(incident.status)
                ]">
                  {{ incident.status }}
                </span>
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">Priority</label>
              <div class="mt-1">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getPriorityColor(incident.priority)
                ]">
                  {{ incident.priority }}
                </span>
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">Assignee</label>
              <div class="mt-1">
                <span class="text-sm text-gray-900">{{ incident.assignee || 'Unassigned' }}</span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Created</label>
              <div class="mt-1 text-sm text-gray-900">
                {{ formatDate(incident.createdAt) }}
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">Last Updated</label>
              <div class="mt-1 text-sm text-gray-900">
                {{ formatDate(incident.updatedAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">Description</h4>
          <p class="text-gray-700">{{ incident.description }}</p>
        </div>

        <!-- Affected Systems -->
        <div class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-3">Affected Systems</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="system in incident.affectedSystems" 
              :key="system"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {{ system }}
            </span>
          </div>
        </div>

        <!-- Timeline -->
        <div class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-4">Timeline</h4>
          <div class="space-y-4">
            <div 
              v-for="(event, index) in incident.timeline" 
              :key="index"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">{{ event.action }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(event.timestamp) }}</p>
                </div>
                <p class="text-sm text-gray-600">by {{ event.user }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="border-t pt-4">
          <div class="flex flex-wrap gap-3">
            <button 
              @click="updateStatus('in-progress')"
              :disabled="incident.status === 'in-progress'"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark In Progress
            </button>
            
            <button 
              @click="updateStatus('resolved')"
              :disabled="incident.status === 'resolved'"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark Resolved
            </button>
            
            <button 
              @click="assignToMe"
              :disabled="incident.assignee === 'Current User'"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Assign to Me
            </button>
            
            <button 
              @click="addComment"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useIncidentsStore } from '@/stores/incidents'

const incidentsStore = useIncidentsStore()

const props = defineProps({
  incident: {
    type: Object,
    required: false,
    default: null
  }
})

const emit = defineEmits(['close', 'update'])

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800'
    case 'investigating': return 'bg-yellow-100 text-yellow-800'
    case 'in-progress': return 'bg-blue-100 text-blue-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const updateStatus = async (newStatus) => {
  try {
    // Update through store
    await incidentsStore.updateIncident(props.incident.id, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    })
    
    // Add timeline entry
    incidentsStore.addTimelineEntry(props.incident.id, {
      timestamp: new Date().toISOString(),
      action: `Status changed to ${newStatus}`,
      user: 'Current User',
      type: 'status_change'
    })
    
    emit('update', { id: props.incident.id, status: newStatus })
    
    // Show success notification
    console.log(`✅ Incident ${props.incident.id} status updated to: ${newStatus}`)
  } catch (error) {
    console.error('Failed to update incident status:', error)
    alert('Failed to update incident status. Please try again.')
  }
}

const assignToMe = async () => {
  try {
    // Update through store
    await incidentsStore.updateIncident(props.incident.id, {
      assignee: 'Current User',
      updatedAt: new Date().toISOString()
    })
    
    // Add timeline entry
    incidentsStore.addTimelineEntry(props.incident.id, {
      timestamp: new Date().toISOString(),
      action: 'Assigned to Current User',
      user: 'Current User',
      type: 'assignment'
    })
    
    emit('update', { id: props.incident.id, assignee: 'Current User' })
    
    console.log(`✅ Incident ${props.incident.id} assigned to current user`)
  } catch (error) {
    console.error('Failed to assign incident:', error)
    alert('Failed to assign incident. Please try again.')
  }
}

const addComment = async () => {
  const comment = prompt('Enter your comment:')
  if (comment && comment.trim()) {
    try {
      // Add comment through store
      incidentsStore.addTimelineEntry(props.incident.id, {
        timestamp: new Date().toISOString(),
        action: comment.trim(),
        user: 'Current User',
        type: 'comment'
      })
      
      console.log(`✅ Comment added to incident ${props.incident.id}`)
    } catch (error) {
      console.error('Failed to add comment:', error)
      alert('Failed to add comment. Please try again.')
    }
  }
}
</script>

<style scoped>
/* Custom fade-in animation for modal */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
