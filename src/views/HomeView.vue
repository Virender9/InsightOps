<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useHealthStore } from '@/stores/health';
import { useIncidentsStore } from '@/stores/incidents';
import { storeToRefs } from 'pinia';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import PerformanceGauge from '@/components/PerformanceGauge.vue';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap, 
  Shield, 
  BarChart3, 
  PieChart, 
  Monitor,
  Globe,
  Users,
  Server
} from 'lucide-vue-next';

const healthStore = useHealthStore();
const incidentsStore = useIncidentsStore();

const { 
  metrics, 
  metricsHistory, 
  performanceTrend,
  cpuHistory,
  memoryHistory,
  latencyHistory 
} = storeToRefs(healthStore);

const { incidents } = storeToRefs(incidentsStore);

// Real-time metrics calculations
const criticalIncidents = computed(() => 
  incidents.value.filter(i => i.priority === 'Critical').length
);

const highPriorityIncidents = computed(() => 
  incidents.value.filter(i => i.priority === 'High').length
);

const averageResolutionTime = computed(() => {
  if (incidents.value.length === 0) return 0;
  const total = incidents.value.reduce((sum, i) => sum + i.resolutionTime, 0);
  return (total / incidents.value.length).toFixed(1);
});

const systemHealthScore = computed(() => {
  if (!metrics.value.cpuUsage) return 0;
  const cpuScore = Math.max(0, 100 - metrics.value.cpuUsage);
  const memoryScore = Math.max(0, 100 - metrics.value.memoryUsage);
  const latencyScore = Math.max(0, 100 - (metrics.value.latency / 2));
  return Math.round((cpuScore + memoryScore + latencyScore) / 3);
});

const incidentsByCategory = computed(() => {
  const categories = {};
  incidents.value.forEach(i => {
    categories[i.category] = (categories[i.category] || 0) + 1;
  });
  return categories;
});

const recentIncidents = computed(() => 
  incidents.value
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
);

onMounted(async () => {
  await Promise.all([
    healthStore.fetchHealthMetrics(),
    incidentsStore.fetchIncidents()
  ]);
  healthStore.startAutoRefresh();
});

onUnmounted(() => {
  healthStore.stopAutoRefresh();
});

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'Critical': return 'text-red-600 bg-red-100';
    case 'High': return 'text-orange-600 bg-orange-100';
    case 'Medium': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-blue-600 bg-blue-100';
  }
};

const formatTimeAgo = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}h ${minutes}m ago`;
  return `${minutes}m ago`;
};
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 rounded-2xl shadow-2xl">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative p-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">InsightOps Command Center</h1>
            <p class="text-blue-100 text-lg">Real-time operational intelligence and system monitoring</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold mb-1">{{ systemHealthScore }}%</div>
            <div class="text-blue-200 text-sm">System Health Score</div>
          </div>
        </div>
        
        <!-- Live Status Indicators -->
        <div class="mt-6 flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-green-200">Systems Online</span>
          </div>
          <div class="flex items-center space-x-2">
            <Monitor class="w-4 h-4 text-blue-300" />
            <span class="text-blue-200">{{ metricsHistory.length }} Data Points</span>
          </div>
          <div class="flex items-center space-x-2">
            <Activity class="w-4 h-4 text-purple-300" />
            <span class="text-purple-200 capitalize">{{ performanceTrend }} Performance</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl shadow-lg border border-red-200 transform hover:scale-105 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="bg-red-500 p-3 rounded-full shadow-lg">
            <AlertTriangle class="h-6 w-6 text-white" />
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-red-600 mb-1">Critical Issues</p>
            <p class="text-3xl font-bold text-red-800">{{ criticalIncidents }}</p>
            <p class="text-xs text-red-500">Requires immediate attention</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl shadow-lg border border-orange-200 transform hover:scale-105 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="bg-orange-500 p-3 rounded-full shadow-lg">
            <Zap class="h-6 w-6 text-white" />
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-orange-600 mb-1">High Priority</p>
            <p class="text-3xl font-bold text-orange-800">{{ highPriorityIncidents }}</p>
            <p class="text-xs text-orange-500">Escalated incidents</p>
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
            <p class="text-xs text-green-500">Mean time to resolve</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-200 transform hover:scale-105 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="bg-blue-500 p-3 rounded-full shadow-lg">
            <Shield class="h-6 w-6 text-white" />
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-blue-600 mb-1">Total Incidents</p>
            <p class="text-3xl font-bold text-blue-800">{{ incidents.length }}</p>
            <p class="text-xs text-blue-500">All time incidents</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Monitoring Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Real-time Performance Gauges -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center space-x-2 mb-4">
          <BarChart3 class="w-6 h-6 text-blue-600" />
          <h2 class="text-2xl font-bold text-gray-800">System Performance</h2>
          <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Live Data
          </div>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PerformanceGauge 
            title="CPU" 
            :value="metrics.cpuUsage" 
            unit="%"
            :thresholds="{ good: 30, warning: 70, critical: 90 }"
          />
          <PerformanceGauge 
            title="Memory" 
            :value="metrics.memoryUsage" 
            unit="%"
            :thresholds="{ good: 40, warning: 80, critical: 95 }"
          />
          <PerformanceGauge 
            title="Disk I/O" 
            :value="metrics.diskIO" 
            :max="50"
            unit=" MB/s"
            :thresholds="{ good: 15, warning: 30, critical: 45 }"
          />
          <PerformanceGauge 
            title="Latency" 
            :value="metrics.latency" 
            :max="200"
            unit="ms"
            :thresholds="{ good: 50, warning: 120, critical: 180 }"
          />
        </div>
      </div>
      
      <!-- Recent Incidents Panel -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Recent Incidents</h3>
          <div class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Live Feed
          </div>
        </div>
        
        <div class="space-y-3">
          <div v-for="incident in recentIncidents" :key="incident.id" 
               class="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ incident.title }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ incident.category }}</p>
              </div>
              <div class="ml-2 flex-shrink-0">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getPriorityColor(incident.priority)">
                  {{ incident.priority }}
                </span>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-2">{{ formatTimeAgo(incident.createdAt) }}</p>
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-t border-gray-200">
          <router-link to="/incidents" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all incidents →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Historical Trends -->
    <div class="space-y-6">
      <div class="flex items-center space-x-2">
        <TrendingUp class="w-6 h-6 text-blue-600" />
        <h2 class="text-2xl font-bold text-gray-800">Performance Trends</h2>
        <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Historical Analysis
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TimeSeriesChart 
          title="CPU Usage Trend"
          :data="cpuHistory"
          color="#3b82f6"
          unit="%"
        />
        <TimeSeriesChart 
          title="Memory Usage Trend"
          :data="memoryHistory"
          color="#10b981"
          unit="%"
        />
        <TimeSeriesChart 
          title="System Latency Trend"
          :data="latencyHistory"
          color="#f59e0b"
          unit="ms"
        />
      </div>
    </div>
    
    <!-- Incident Analytics -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div class="flex items-center space-x-2 mb-6">
        <PieChart class="w-6 h-6 text-purple-600" />
        <h2 class="text-2xl font-bold text-gray-800">Incident Analytics</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(count, category) in incidentsByCategory" :key="category" 
             class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-gray-800">{{ count }}</div>
          <div class="text-sm text-gray-600 mt-1">{{ category }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
