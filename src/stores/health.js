import { defineStore } from 'pinia';
import axios from 'axios';

// API Configuration - using Mockfast API for deployment
// const MOCKFAST_API_URL = 'http://localhost:4000/metrics'; // Local development only
const MOCKFAST_API_URL = 'https://mockfast.io/backend/apitemplate/get/8BE4BTI4RW'; // Production mock API

// Embedded mock data for deployment
const EMBEDDED_METRICS = [
  {
    "id": "m1",
    "cpuUsage": 22,
    "memoryUsage": 48,
    "diskIO": 11,
    "latency": 120,
    "timestamp": "2025-08-04T09:45:00Z"
  },
  {
    "id": "m2",
    "cpuUsage": 24,
    "memoryUsage": 50,
    "diskIO": 12,
    "latency": 115,
    "timestamp": "2025-08-04T09:50:00Z"
  },
  {
    "id": "m3",
    "cpuUsage": 26,
    "memoryUsage": 52,
    "diskIO": 13,
    "latency": 110,
    "timestamp": "2025-08-04T09:55:00Z"
  },
  {
    "id": "m4",
    "cpuUsage": 28,
    "memoryUsage": 55,
    "diskIO": 14,
    "latency": 105,
    "timestamp": "2025-08-04T10:00:00Z"
  },
  {
    "id": "m5",
    "cpuUsage": 30,
    "memoryUsage": 57,
    "diskIO": 15,
    "latency": 100,
    "timestamp": "2025-08-04T10:05:00Z"
  }
];

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
        // Try to fetch from Mockfast API for deployment
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
        // Fall back to embedded data for deployment
        console.log('📈 Using embedded demo data for deployment');
        if (Array.isArray(EMBEDDED_METRICS) && EMBEDDED_METRICS.length > 0) {
          this.metricsHistory = EMBEDDED_METRICS;
          this.metrics = EMBEDDED_METRICS[EMBEDDED_METRICS.length - 1];
          console.log('📈 Embedded metrics loaded:', this.metrics);
          console.log('📈 Historical data points:', EMBEDDED_METRICS.length);
        }
      } finally {
        this.loading = false;
      }
    },
    
    startAutoRefresh() {
      if (this.autoRefresh) {
        clearInterval(this.autoRefresh);
      }
      
      this.autoRefresh = setInterval(() => {
        this.fetchHealthMetrics();
      }, 30000); // Refresh every 30 seconds
    },

    stopAutoRefresh() {
      if (this.autoRefresh) {
        clearInterval(this.autoRefresh);
        this.autoRefresh = null;
      }
    },

    // Cleanup method for component unmount
    destroy() {
      this.stopAutoRefresh();
    },

    // Alias for fetchHealthMetrics - for compatibility with components
    async fetchHealthData() {
      return await this.fetchHealthMetrics();
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
