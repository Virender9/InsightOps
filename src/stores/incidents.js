import { defineStore } from 'pinia';
import axios from 'axios';

// This is a sample Mockfast API endpoint. You can create your own at mockfast.io
const MOCKFAST_API_URL = 'http://localhost:4000/incidents';
// const MOCKFAST_API_URL = 'https://mockfast.io/backend/apitemplate/get/KV4AYFMWAF';

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
        // Fetch from local json-server
        const response = await axios.get(MOCKFAST_API_URL);
        console.log('📊 Incidents fetched from API:', response.data);
        this.incidents = response.data;
        console.log('📊 Incidents stored in Pinia:', this.incidents);

      } catch (error) {
        this.error = 'Failed to fetch incidents. Please try again later.';
        console.error('Error fetching incidents:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
