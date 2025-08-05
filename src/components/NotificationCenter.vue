<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="showNotifications = !showNotifications"
      class="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 8a3 3 0 11-6 0 3 3 0 016 0zM8 21V10a1 1 0 011-1h6a1 1 0 011 1v11" />
      </svg>
      
      <!-- Notification Badge -->
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <div 
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
        <div class="flex items-center space-x-2">
          <button 
            @click="markAllAsRead"
            class="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark all read
          </button>
          <button 
            @click="clearAll"
            class="text-xs text-red-600 hover:text-red-800"
          >
            Clear all
          </button>
        </div>
      </div>

      <!-- Notification List -->
      <div class="max-h-80 overflow-y-auto">
        <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2 2m0 0l-2-2m2 2v6" />
          </svg>
          No notifications
        </div>
        
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="[
            'px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
            !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
          ]"
        >
          <div class="flex items-start">
            <!-- Icon based on type -->
            <div :class="[
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3',
              getNotificationIconClass(notification.type)
            ]">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path :d="getNotificationIcon(notification.type)" />
              </svg>
            </div>
            
            <div class="flex-1 min-w-0">
              <p :class="[
                'text-sm font-medium',
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              ]">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
              <div class="flex items-center justify-between mt-2">
                <p class="text-xs text-gray-500">{{ formatTime(notification.timestamp) }}</p>
                <div class="flex items-center space-x-2">
                  <span :class="[
                    'text-xs px-2 py-1 rounded-full font-medium',
                    getPriorityClass(notification.priority)
                  ]">
                    {{ notification.priority }}
                  </span>
                  <button 
                    v-if="!notification.read"
                    @click.stop="markAsRead(notification.id)"
                    class="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark read
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <button 
          @click="viewAllNotifications"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>

    <!-- Click outside to close -->
    <div 
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { dataService } from '@/services/dataService'

const showNotifications = ref(false)
const notifications = ref([])

// Sample notifications for demo
const sampleNotifications = [
  {
    id: 1,
    type: 'incident',
    title: 'New Critical Incident',
    message: 'Database connection failure detected in production environment',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
    priority: 'critical',
    read: false,
    source: 'System Monitor'
  },
  {
    id: 2,
    type: 'alert',
    title: 'High CPU Usage Alert',
    message: 'Server WEB-PROD-01 CPU usage exceeded 85% threshold',
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
    priority: 'high',
    read: false,
    source: 'Performance Monitor'
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Scheduled Maintenance',
    message: 'Database maintenance window starts in 2 hours',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    priority: 'medium',
    read: true,
    source: 'Maintenance Scheduler'
  },
  {
    id: 4,
    type: 'security',
    title: 'Security Scan Complete',
    message: 'Weekly security scan completed - 0 critical vulnerabilities found',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    priority: 'low',
    read: true,
    source: 'Security Scanner'
  }
]

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Methods
const loadNotifications = async () => {
  try {
    // In a real app, this would fetch from an API
    notifications.value = sampleNotifications
  } catch (error) {
    console.error('Error loading notifications:', error)
  }
}

const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const clearAll = () => {
  notifications.value = []
  showNotifications.value = false
}

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  
  // Handle navigation based on notification type
  switch (notification.type) {
    case 'incident':
      console.log('Navigate to incidents view')
      break
    case 'alert':
      console.log('Navigate to health view')
      break
    case 'maintenance':
      console.log('Navigate to maintenance view')
      break
    default:
      console.log('Unknown notification type')
  }
}

const viewAllNotifications = () => {
  showNotifications.value = false
  console.log('Navigate to notifications page')
}

const getNotificationIconClass = (type) => {
  switch (type) {
    case 'incident': return 'bg-red-100 text-red-600'
    case 'alert': return 'bg-yellow-100 text-yellow-600'
    case 'maintenance': return 'bg-blue-100 text-blue-600'
    case 'security': return 'bg-green-100 text-green-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'incident': return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'alert': return 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
    case 'maintenance': return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
    case 'security': return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

// Simulate real-time notifications
let notificationInterval = null

const simulateRealTimeNotifications = () => {
  notificationInterval = setInterval(() => {
    // Randomly add new notifications
    if (Math.random() < 0.3) { // 30% chance every 30 seconds
      const newNotification = {
        id: Date.now(),
        type: ['incident', 'alert', 'maintenance', 'security'][Math.floor(Math.random() * 4)],
        title: 'Real-time Update',
        message: 'This is a simulated real-time notification',
        timestamp: new Date().toISOString(),
        priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
        read: false,
        source: 'Real-time Monitor'
      }
      notifications.value.unshift(newNotification)
      
      // Keep only latest 20 notifications
      if (notifications.value.length > 20) {
        notifications.value = notifications.value.slice(0, 20)
      }
    }
  }, 30000) // Every 30 seconds
}

// Lifecycle
onMounted(() => {
  loadNotifications()
  simulateRealTimeNotifications()
})

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval)
  }
})
</script>
