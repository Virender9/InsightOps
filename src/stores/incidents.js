import { defineStore } from 'pinia';
import axios from 'axios';

// API Configuration - using Mockfast API for deployment
// const MOCKFAST_API_URL = 'http://localhost:4000/incidents'; // Local development only
const MOCKFAST_API_URL = 'https://mockfast.io/backend/apitemplate/get/KV4AYFMWAF'; // Production mock API

// Embedded mock data for deployment
const EMBEDDED_INCIDENTS = [
  {
    "id": "1",
    "title": "Core Router Flapping",
    "category": "Network",
    "priority": "High",
    "resolutionTime": 2,
    "description": "Primary core router experiencing intermittent packet loss.",
    "createdAt": "2025-08-04T09:50:00Z"
  },
  {
    "id": "2",
    "title": "Database High Latency",
    "category": "Database",
    "priority": "Medium",
    "resolutionTime": 8,
    "description": "Increased query latency on customer database.",
    "createdAt": "2025-08-04T10:00:00Z"
  },
  {
    "id": "3",
    "title": "Payment Gateway API Failure",
    "category": "API",
    "priority": "Critical",
    "resolutionTime": 1,
    "description": "Third-party payment API returning 500 errors.",
    "createdAt": "2025-08-04T10:05:00Z"
  }
];

export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    incidents: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchIncidents() {
      this.loading = true;
      this.error = null;
      try {
        // Try to fetch from Mockfast API for deployment
        const response = await axios.get(MOCKFAST_API_URL);
        console.log('📊 Incidents fetched from API:', response.data);
        this.incidents = response.data;
        console.log('📊 Incidents stored in Pinia:', this.incidents);
      } catch (error) {
        // Fall back to embedded data for deployment
        console.log('📊 Using embedded demo data for deployment');
        this.incidents = EMBEDDED_INCIDENTS;
        console.log('📊 Embedded incidents loaded:', this.incidents);
      } finally {
        this.loading = false;
      }
    },
  },
});
