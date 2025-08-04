<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useHealthStore } from '@/stores/health';
import { storeToRefs } from 'pinia';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import PerformanceGauge from '@/components/PerformanceGauge.vue';
import { Cpu, MemoryStick, HardDrive, Timer, Activity, TrendingUp, AlertTriangle } from 'lucide-vue-next';
import { LoaderCircle } from 'lucide-vue-next';

const healthStore = useHealthStore();
const { 
  metrics, 
  metricsHistory, 
  loading, 
  error, 
  cpuHistory, 
  memoryHistory, 
  latencyHistory, 
  performanceTrend 
} = storeToRefs(healthStore);

onMounted(async () => {
  await healthStore.fetchHealthMetrics();
  // Start auto-refresh for real-time updates
  healthStore.startAutoRefresh();
});

onUnmounted(() => {
  // Clean up auto-refresh when component is destroyed
  healthStore.stopAutoRefresh();
});

const getTrendColor = (trend) => {
  switch(trend) {
    case 'optimal': return 'text-green-600';
    case 'degrading': return 'text-red-600';
    default: return 'text-blue-600';
  }
};

const getTrendIcon = (trend) => {
  switch(trend) {
    case 'optimal': return 'text-green-500';
    case 'degrading': return 'text-red-500';
    default: return 'text-blue-500';
  }
};
</script>

<template>
  <div class="space-y-8">
    <!-- Header with Performance Overview -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          System Performance Analytics
        </h1>
        <p class="text-gray-600 mt-2">Real-time monitoring and historical analysis</p>
      </div>
      
      <!-- Performance Trend Indicator -->
      <div v-if="!loading && !error" class="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-lg border">
        <Activity :class="getTrendIcon(performanceTrend)" class="w-6 h-6" />
        <div>
          <p class="text-sm text-gray-500">System Trend</p>
          <p class="font-semibold capitalize" :class="getTrendColor(performanceTrend)">{{ performanceTrend }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <LoaderCircle class="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p class="text-lg text-gray-600">Loading system metrics...</p>
        <p class="text-sm text-gray-400">Fetching real-time data</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-xl p-6">
      <div class="flex items-center">
        <AlertTriangle class="h-8 w-8 text-red-600 mr-4" />
        <div>
          <h3 class="text-lg font-semibold text-red-800">System Health Error</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Advanced Analytics Dashboard -->
    <div v-else class="space-y-8">
      
      <!-- Performance Gauges -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PerformanceGauge 
          title="CPU Usage" 
          :value="metrics.cpuUsage" 
          unit="%"
          :thresholds="{ good: 30, warning: 70, critical: 90 }"
        />
        <PerformanceGauge 
          title="Memory Usage" 
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

      <!-- Historical Charts -->
      <div class="space-y-6">
        <div class="flex items-center space-x-2 mb-4">
          <TrendingUp class="w-6 h-6 text-blue-600" />
          <h2 class="text-2xl font-bold text-gray-800">Historical Performance Trends</h2>
          <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ metricsHistory.length }} data points
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimeSeriesChart 
            title="CPU Usage Over Time"
            :data="cpuHistory"
            color="#3b82f6"
            unit="%"
          />
          <TimeSeriesChart 
            title="Memory Usage Over Time"
            :data="memoryHistory"
            color="#10b981"
            unit="%"
          />
          <TimeSeriesChart 
            title="System Latency"
            :data="latencyHistory"
            color="#f59e0b"
            unit="ms"
          />
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Average CPU:</span>
                <span class="font-semibold">{{ Math.round(metricsHistory.reduce((sum, m) => sum + m.cpuUsage, 0) / metricsHistory.length) }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Peak Memory:</span>
                <span class="font-semibold">{{ Math.max(...metricsHistory.map(m => m.memoryUsage)) }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Min Latency:</span>
                <span class="font-semibold">{{ Math.min(...metricsHistory.map(m => m.latency)) }}ms</span>
              </div>
              <div class="mt-4 p-3 bg-white rounded-lg border">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm text-gray-600">Auto-refresh: 30s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
