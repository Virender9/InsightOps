<template>
  <div class="relative">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        @focus="showResults = true"
        @blur="hideResults"
        type="text"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        :placeholder="placeholder"
      />
    </div>

    <!-- Search Results Dropdown -->
    <div 
      v-if="showResults && searchQuery && filteredResults.length > 0"
      class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
    >
      <div 
        v-for="result in filteredResults" 
        :key="result.id"
        @click="selectResult(result)"
        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
      >
        <div class="flex items-center">
          <div :class="[
            'flex-shrink-0 h-2 w-2 rounded-full',
            result.type === 'incident' ? 'bg-red-500' :
            result.type === 'server' ? 'bg-blue-500' :
            result.type === 'alert' ? 'bg-yellow-500' : 'bg-green-500'
          ]"></div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ result.title }}</p>
            <p class="text-xs text-gray-500">{{ result.type }} • {{ result.description }}</p>
          </div>
          <div class="text-xs text-gray-400">
            {{ result.timestamp }}
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div 
      v-if="showResults && searchQuery && filteredResults.length === 0"
      class="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-3 px-3 text-sm text-gray-500"
    >
      No results found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dataService } from '@/services/dataService'
import { useRouter } from 'vue-router'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search incidents, servers, alerts...'
  }
})

const emit = defineEmits(['select'])
const router = useRouter()

const searchQuery = ref('')
const showResults = ref(false)
const searchableData = ref([])

// Load searchable data
onMounted(async () => {
  try {
    const [incidents, servers, alerts] = await Promise.all([
      dataService.getIncidents(),
      dataService.getServers(), 
      dataService.getAlerts()
    ])

    searchableData.value = [
      ...incidents.data.map(item => ({
        id: `incident-${item.id}`,
        type: 'incident',
        title: item.title,
        description: `${item.status} • ${item.priority}`,
        timestamp: new Date(item.createdAt).toLocaleDateString(),
        route: '/incidents',
        data: item
      })),
      ...servers.data.map(item => ({
        id: `server-${item.id}`,
        type: 'server', 
        title: item.name,
        description: `${item.location} • ${item.status}`,
        timestamp: new Date(item.lastUpdated).toLocaleDateString(),
        route: '/health',
        data: item
      })),
      ...alerts.data.map(item => ({
        id: `alert-${item.id}`,
        type: 'alert',
        title: item.title,
        description: `${item.severity} • ${item.source}`,
        timestamp: new Date(item.timestamp).toLocaleDateString(),
        route: '/health',
        data: item
      }))
    ]
  } catch (error) {
    console.error('Error loading search data:', error)
  }
})

const filteredResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const query = searchQuery.value.toLowerCase()
  return searchableData.value
    .filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    )
    .slice(0, 8) // Limit results
})

const selectResult = (result) => {
  searchQuery.value = ''
  showResults.value = false
  emit('select', result)
  
  // Navigate to appropriate route
  router.push(result.route)
}

const hideResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200) // Delay to allow click events
}
</script>
