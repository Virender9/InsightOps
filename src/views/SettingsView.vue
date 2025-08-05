<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
            <div class="flex items-center space-x-2">
              <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              <span class="text-sm text-gray-600">Enterprise Configuration</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Settings Navigation -->
        <div class="bg-white rounded-lg shadow border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Configuration</h3>
          </div>
          <nav class="p-2">
            <div class="space-y-1">
              <button 
                v-for="section in settingSections" 
                :key="section.id"
                @click="activeSection = section.id"
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-left',
                  activeSection === section.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-900 hover:bg-gray-50'
                ]"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="section.icon" />
                </svg>
                {{ section.name }}
              </button>
            </div>
          </nav>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- General Settings -->
          <div v-if="activeSection === 'general'" class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">General Settings</h3>
            </div>
            <div class="p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Dashboard Name</label>
                <input 
                  v-model="settings.dashboardName"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Refresh Interval (seconds)</label>
                <select v-model="settings.refreshInterval" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                </select>
              </div>
              <div class="flex items-center">
                <input 
                  v-model="settings.darkMode"
                  type="checkbox" 
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-900">Enable Dark Mode</label>
              </div>
            </div>
          </div>

          <!-- API Settings -->
          <div v-if="activeSection === 'api'" class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">API Configuration</h3>
            </div>
            <div class="p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Mode</label>
                <select v-model="settings.apiMode" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="sample">Sample Data</option>
                  <option value="live">Live API</option>
                </select>
              </div>
              <div v-if="settings.apiMode === 'live'">
                <label class="block text-sm font-medium text-gray-700 mb-2">API Base URL</label>
                <input 
                  v-model="settings.apiBaseUrl"
                  type="url" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.example.com"
                >
              </div>
              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div class="flex">
                  <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.724-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">API Configuration Notice</h3>
                    <p class="mt-1 text-sm text-yellow-700">Changes to API settings require a page refresh to take effect.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div v-if="activeSection === 'notifications'" class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Notification Preferences</h3>
            </div>
            <div class="p-6 space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p class="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input 
                    v-model="settings.emailNotifications"
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Browser Notifications</h4>
                    <p class="text-sm text-gray-500">Show desktop notifications</p>
                  </div>
                  <input 
                    v-model="settings.browserNotifications"
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Critical Alerts Only</h4>
                    <p class="text-sm text-gray-500">Only notify for critical incidents</p>
                  </div>
                  <input 
                    v-model="settings.criticalOnly"
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end">
            <button 
              @click="saveSettings"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50">
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeSection = ref('general')

const settingSections = ref([
  {
    id: 'general',
    name: 'General',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    id: 'api',
    name: 'API',
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: 'M15 17h5l-5 5v-5zM12 8a3 3 0 11-6 0 3 3 0 016 0zM8 21V10a1 1 0 011-1h6a1 1 0 011 1v11'
  }
])

const settings = reactive({
  dashboardName: 'InsightOps Enterprise Console',
  refreshInterval: '30',
  darkMode: false,
  apiMode: 'sample',
  apiBaseUrl: '',
  emailNotifications: true,
  browserNotifications: true,
  criticalOnly: false
})

const showToast = ref(false)
const toastMessage = ref('')

const saveSettings = () => {
  try {
    // Save settings to localStorage or send to API
    localStorage.setItem('insightops-settings', JSON.stringify(settings))
    console.log('Settings saved:', settings)
    
    // Show success message
    toastMessage.value = 'Settings saved successfully!'
    showToast.value = true
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false
    }, 3000)
    
    // If API mode changed, suggest page refresh
    if (settings.apiMode !== (JSON.parse(localStorage.getItem('insightops-settings') || '{}').apiMode || 'sample')) {
      setTimeout(() => {
        if (confirm('API mode has changed. Would you like to refresh the page to apply changes?')) {
          window.location.reload()
        }
      }, 500)
    }
  } catch (error) {
    toastMessage.value = 'Error saving settings. Please try again.'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

// Load settings on component mount
const loadSettings = () => {
  const saved = localStorage.getItem('insightops-settings')
  if (saved) {
    Object.assign(settings, JSON.parse(saved))
  }
}

loadSettings()
</script>
