<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Professional Header -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-white rounded-lg p-2">
            <Activity class="w-8 h-8 text-blue-600" />
          </div>
          <div class="text-white">
            <h1 class="text-2xl font-bold">AI Operations Center</h1>
            <p class="text-sm opacity-90">Intelligent Monitoring & Automated Response</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg">
            <span class="text-sm">Test Working</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Test Content -->
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">AI Operations Test</h2>
        <p class="text-gray-600">This is a test version to ensure the component loads properly.</p>
        
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-blue-900">Test Card 1</h3>
            <p class="text-blue-700">Component is loading</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="font-semibold text-green-900">Test Card 2</h3>
            <p class="text-green-700">No loading issues</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <h3 class="font-semibold text-purple-900">Test Card 3</h3>
            <p class="text-purple-700">Ready for full version</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity } from 'lucide-vue-next'

console.log('🧪 AI Operations Test Component Loaded Successfully!')
</script>
