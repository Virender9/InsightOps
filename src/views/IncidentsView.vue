<script setup>
import { onMounted, ref, computed } from 'vue';
import { useIncidentsStore } from '@/stores/incidents';
import { storeToRefs } from 'pinia';
import { LoaderCircle, AlertTriangle, ShieldAlert, FileText, Clock, Zap } from 'lucide-vue-next';
import IncidentChart from '@/components/IncidentChart.vue';
import IncidentDetailsModal from '@/components/IncidentDetailsModal.vue';

const incidentsStore = useIncidentsStore();
const { incidents, loading, error } = storeToRefs(incidentsStore);

const priorityFilter = ref('All');
const priorityOptions = computed(() => ['All', ...new Set(incidents.value.map(i => i.priority))]);

const totalIncidents = computed(() => incidents.value.length);
const highPriorityIncidents = computed(() => incidents.value.filter(i => i.priority === 'High').length);
const criticalIncidents = computed(() => incidents.value.filter(i => i.priority === 'Critical').length);
const averageResolutionTime = computed(() => {
  if (incidents.value.length === 0) return 0;
  const total = incidents.value.reduce((sum, i) => sum + i.resolutionTime, 0);
  return (total / incidents.value.length).toFixed(1);
});

const selectedIncident = ref(null);
const isModalVisible = ref(false);

const openModal = (incident) => {
  selectedIncident.value = incident;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  selectedIncident.value = null;
};

const filteredIncidents = computed(() => {
  return incidents.value.filter(incident => {
    const priorityMatch = priorityFilter.value === 'All' || incident.priority === priorityFilter.value;
    return priorityMatch;
  });
});

onMounted(() => {
  incidentsStore.fetchIncidents();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Incidents Analysis</h1>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-200 transform hover:scale-105 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="bg-blue-500 p-3 rounded-full shadow-lg">
            <FileText class="h-6 w-6 text-white" />
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-blue-600 mb-1">Total Incidents</p>
            <p class="text-3xl font-bold text-blue-800">{{ totalIncidents }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl shadow-lg border border-red-200 transform hover:scale-105 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="bg-red-500 p-3 rounded-full shadow-lg">
            <Zap class="h-6 w-6 text-white" />
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-red-600 mb-1">Critical Priority</p>
            <p class="text-3xl font-bold text-red-800">{{ criticalIncidents }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl shadow-lg border border-orange-200 transform hover:scale-105 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="bg-orange-500 p-3 rounded-full shadow-lg">
            <ShieldAlert class="h-6 w-6 text-white" />
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-orange-600 mb-1">High Priority</p>
            <p class="text-3xl font-bold text-orange-800">{{ highPriorityIncidents }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border border-green-200 transform hover:scale-105 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="bg-green-500 p-3 rounded-full shadow-lg">
            <Clock class="h-6 w-6 text-white" />
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-green-600 mb-1">Avg Resolution</p>
            <p class="text-3xl font-bold text-green-800">{{ averageResolutionTime }}h</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="mt-4 flex space-x-4">
      
      <div>
        <label for="priority-filter" class="block text-sm font-medium text-gray-700">Filter by Priority</label>
        <select id="priority-filter" v-model="priorityFilter" class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
          <option v-for="priority in priorityOptions" :key="priority" :value="priority">{{ priority }}</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="mt-8 flex items-center justify-center">
      <LoaderCircle class="h-12 w-12 animate-spin text-blue-600" />
      <p class="ml-4 text-lg text-gray-600">Loading incidents...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-8 flex items-center rounded-lg border border-red-300 bg-red-50 p-4">
      <AlertTriangle class="h-6 w-6 text-red-600" />
      <p class="ml-4 text-red-800">{{ error }}</p>
    </div>

    <!-- Chart and Data Table -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div class="lg:col-span-1">
        <IncidentChart :chartData="incidents" />
      </div>
      <div class="lg:col-span-2 overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Incident</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Resolution</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="incident in filteredIncidents" :key="incident.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-start space-x-3">
                  <component :is="getPriorityIcon(incident.priority)" class="w-5 h-5 mt-0.5" :class="getPriorityColor(incident.priority).text" />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ incident.title }}</p>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ incident.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="`${getPriorityColor(incident.priority).bg} ${getPriorityColor(incident.priority).text} ${getPriorityColor(incident.priority).border} border`">
                  {{ incident.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <Tag class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-900">{{ incident.category }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-900">{{ incident.resolutionTime }}h</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTimeAgo(incident.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="openModal(incident)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs flex items-center space-x-1 transition-colors">
                  <Eye class="w-3 h-3" />
                  <span>View</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredIncidents.length === 0" class="px-6 py-12 text-center">
          <AlertCircle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
          <p class="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    </div>

    <!-- Incident Details Modal -->
    <IncidentDetailsModal 
      :show="isModalVisible" 
      :incident="selectedIncident" 
      @close="closeModal"
      v-if="selectedIncident"
    />
  </div>
</template>
