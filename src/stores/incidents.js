import { defineStore } from 'pinia';
import axios from 'axios';

// API Configuration - using local mock API for development
const MOCKFAST_API_URL = 'http://localhost:4000/incidents'; // Local development API
// const MOCKFAST_API_URL = 'https://mockfast.io/backend/apitemplate/get/KV4AYFMWAF'; // Production mock API

// Embedded mock data for deployment
const EMBEDDED_INCIDENTS = [
  {
    "id": "1",
    "title": "Core Router Flapping",
    "category": "Network",
    "priority": "High",
    "status": "investigating",
    "resolutionTime": 2,
    "description": "Primary core router experiencing intermittent packet loss.",
    "createdAt": "2025-08-04T09:50:00Z"
  },
  {
    "id": "2",
    "title": "Database High Latency",
    "category": "Database",
    "priority": "Medium",
    "status": "monitoring",
    "resolutionTime": 8,
    "description": "Increased query latency on customer database.",
    "createdAt": "2025-08-04T10:00:00Z"
  },
  {
    "id": "3",
    "title": "Payment Gateway API Failure",
    "category": "API",
    "priority": "Critical",
    "status": "resolved",
    "resolutionTime": 1,
    "description": "Third-party payment API returning 500 errors.",
    "createdAt": "2025-08-04T10:05:00Z"
  },
  {
    "id": "4",
    "title": "Load Balancer Timeout",
    "category": "Infrastructure",
    "priority": "Medium",
    "status": "investigating",
    "resolutionTime": 4,
    "description": "Load balancer timing out on health checks.",
    "createdAt": "2025-08-04T11:20:00Z"
  }
];

export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    incidents: [],
    loading: false,
    error: null,
  }),
  getters: {
    recentIncidents: (state) => 
      state.incidents
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
    
    activeCount: (state) => 
      state.incidents.filter(incident => 
        incident.status !== 'resolved' && incident.status !== 'closed'
      ).length,
    
    trend: (state) => {
      // Simple trend calculation
      const recent = state.incidents.filter(incident => {
        const incidentTime = new Date(incident.createdAt)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return incidentTime > oneDayAgo
      }).length
      
      const previous = state.incidents.filter(incident => {
        const incidentTime = new Date(incident.createdAt)
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return incidentTime > twoDaysAgo && incidentTime <= oneDayAgo
      }).length
      
      if (previous === 0) return recent > 0 ? 100 : 0
      return Math.round(((recent - previous) / previous) * 100)
    }
  },
  actions: {
    async fetchIncidents() {
      this.loading = true;
      try {
        console.log('Fetching incidents data...');
        const response = await axios.get(MOCKFAST_API_URL);
        
        // If API call fails or returns empty, use embedded data
        if (response.data && response.data.length > 0) {
          this.incidents = response.data;
        } else {
          console.log('Using embedded incidents data...');
          this.incidents = EMBEDDED_INCIDENTS;
        }
        
      } catch (error) {
        console.warn('Failed to fetch from API, using embedded data:', error.message);
        this.incidents = EMBEDDED_INCIDENTS;
      } finally {
        this.loading = false;
      }
    },
    
    async updateIncident(incidentId, updates) {
      try {
        const index = this.incidents.findIndex(inc => inc.id === incidentId);
        if (index !== -1) {
          this.incidents[index] = { ...this.incidents[index], ...updates };
          
          // In real implementation, would make API call
          // await axios.put(`${MOCKFAST_API_URL}/${incidentId}`, updates);
          
          console.log(`Incident ${incidentId} updated successfully`);
        }
      } catch (error) {
        console.error('Failed to update incident:', error);
        throw error;
      }
    },
    
    addTimelineEntry(incidentId, entry) {
      const incident = this.incidents.find(inc => inc.id === incidentId);
      if (incident) {
        if (!incident.timeline) {
          incident.timeline = [];
        }
        incident.timeline.push(entry);
        
        // In real implementation, would make API call
        // await axios.post(`${MOCKFAST_API_URL}/${incidentId}/timeline`, entry);
        
        console.log(`Timeline entry added to incident ${incidentId}`);
      }
    },
    
    async createIncident(incidentData) {
      try {
        const newIncident = {
          id: Date.now().toString(),
          ...incidentData,
          createdAt: new Date().toISOString(),
          timeline: [{
            timestamp: new Date().toISOString(),
            action: 'Incident created',
            user: 'System',
            type: 'creation'
          }]
        };
        
        this.incidents.unshift(newIncident);
        
        // In real implementation, would make API call
        // await axios.post(MOCKFAST_API_URL, newIncident);
        
        console.log(`New incident ${newIncident.id} created`);
        return newIncident;
      } catch (error) {
        console.error('Failed to create incident:', error);
        throw error;
      }
    },
  },
});
