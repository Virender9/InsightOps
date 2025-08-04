import { defineStore } from 'pinia';
import axios from 'axios';

// IMPORTANT: Replace with your actual Mockfast API endpoint for health metrics
const MOCKFAST_API_URL = 'http://localhost:4000/metrics';
// const MOCKFAST_API_URL = 'https://mockfast.io/backend/apitemplate/get/8BE4BTI4RW';

export const useHealthStore = defineStore('health', {
  state: () => ({
    metrics: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskIO: 0,
      latency: 0,
      timestamp: null,
    },
    metricsHistory: [],
    loading: false,
    error: null,
    autoRefresh: null,
  }),
  actions: {
    async fetchHealthMetrics() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch from local json-server - get all metrics for historical analysis
        const response = await axios.get(MOCKFAST_API_URL);
        console.log('📈 All metrics fetched from API:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Store all historical data
          this.metricsHistory = response.data;
          // Take the most recent metric for current display
          this.metrics = response.data[response.data.length - 1];
          console.log('📈 Latest metrics stored:', this.metrics);
          console.log('📈 Historical data points:', response.data.length);
        } else {
          throw new Error('No metrics data available');
        }

      } catch (error) {
        this.error = 'Failed to fetch system health metrics.';
        console.error('Error fetching health metrics:', error);
      } finally {
        this.loading = false;
      }
    },
    
    startAutoRefresh() {
      // Auto-refresh every 30 seconds
      this.autoRefresh = setInterval(() => {
        console.log('🔄 Auto-refreshing metrics...');
        this.fetchHealthMetrics();
      }, 30000);
    },
    
    stopAutoRefresh() {
      if (this.autoRefresh) {
        clearInterval(this.autoRefresh);
        this.autoRefresh = null;
      }
    },
  },
  
  getters: {
    // Get chart data for historical visualization
    cpuHistory: (state) => state.metricsHistory.map(m => ({
      x: new Date(m.timestamp).getTime(),
      y: m.cpuUsage
    })),
    
    memoryHistory: (state) => state.metricsHistory.map(m => ({
      x: new Date(m.timestamp).getTime(), 
      y: m.memoryUsage
    })),
    
    latencyHistory: (state) => state.metricsHistory.map(m => ({
      x: new Date(m.timestamp).getTime(),
      y: m.latency
    })),
    
    // Performance trend analysis
    performanceTrend: (state) => {
      if (state.metricsHistory.length < 2) return 'stable';
      const recent = state.metricsHistory.slice(-3);
      const avgCpu = recent.reduce((sum, m) => sum + m.cpuUsage, 0) / recent.length;
      const avgMemory = recent.reduce((sum, m) => sum + m.memoryUsage, 0) / recent.length;
      
      if (avgCpu > 70 || avgMemory > 80) return 'degrading';
      if (avgCpu < 30 && avgMemory < 50) return 'optimal';
      return 'stable';
    }
  }
});
