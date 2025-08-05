<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-semibold text-gray-900">Support & Help</h1>
            <div class="flex items-center space-x-2">
              <div class="h-2 w-2 rounded-full bg-green-500"></div>
              <span class="text-sm text-gray-600">24/7 Enterprise Support</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div class="p-6 space-y-4">
            <button class="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
              <svg class="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Open Support Ticket
            </button>
            <button class="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
              <svg class="h-5 w-5 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
              </svg>
              Live Chat
            </button>
            <button class="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
              <svg class="h-5 w-5 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Request Phone Call
            </button>
          </div>
        </div>

        <!-- Main Support Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- FAQ Section -->
          <div class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-200 pb-4 last:border-b-0">
                  <button 
                    @click="faq.expanded = !faq.expanded"
                    class="w-full flex justify-between items-center text-left py-2 focus:outline-none"
                  >
                    <h4 class="text-sm font-medium text-gray-900">{{ faq.question }}</h4>
                    <svg 
                      :class="['h-5 w-5 text-gray-500 transform transition-transform', faq.expanded ? 'rotate-180' : '']"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="faq.expanded" class="mt-3 text-sm text-gray-600">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Documentation Links -->
          <div class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Documentation & Resources</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="resource in resources" :key="resource.title" class="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div :class="['flex-shrink-0 p-2 rounded-md', resource.color]">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="resource.icon" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">{{ resource.title }}</h4>
                    <p class="text-sm text-gray-500 mt-1">{{ resource.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Enterprise Support</h4>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a4 4 0 005.66 0L21 11.31V8a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      support@insightops.com
                    </div>
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +1 (800) 123-4567
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Business Hours</h4>
                  <div class="space-y-1 text-sm text-gray-600">
                    <div>Monday - Friday: 8:00 AM - 8:00 PM EST</div>
                    <div>Saturday: 9:00 AM - 5:00 PM EST</div>
                    <div>Sunday: Emergency support only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const faqs = ref([
  {
    question: 'How do I switch between sample data and live API mode?',
    answer: 'Go to Settings > API Configuration and change the API Mode from "Sample Data" to "Live API". You\'ll need to configure your API endpoints and refresh the page.',
    expanded: false
  },
  {
    question: 'Why are my alerts not showing up?',
    answer: 'Check your API configuration and ensure your endpoints are accessible. Also verify that your notification settings allow the type of alerts you\'re expecting.',
    expanded: false
  },
  {
    question: 'How can I customize the dashboard refresh interval?',
    answer: 'Navigate to Settings > General Settings and adjust the "Refresh Interval" dropdown to your preferred timing.',
    expanded: false
  },
  {
    question: 'What browsers are supported?',
    answer: 'InsightOps supports all modern browsers including Chrome 80+, Firefox 75+, Safari 13+, and Edge 80+.',
    expanded: false
  }
])

const resources = ref([
  {
    title: 'User Guide',
    description: 'Complete user documentation and tutorials',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: 'bg-blue-500'
  },
  {
    title: 'API Documentation',
    description: 'Integration guides and API references',
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: 'bg-green-500'
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    color: 'bg-purple-500'
  },
  {
    title: 'Release Notes',
    description: 'Latest updates and feature announcements',
    icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4z',
    color: 'bg-orange-500'
  }
])
</script>
