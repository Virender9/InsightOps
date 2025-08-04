import { defineStore } from 'pinia';
import axios from 'axios';

// This is a sample Mockfast API endpoint for AI analysis.
const MOCKFAST_API_URL = 'https://api.mockfast.io/b9a8-4a88-85e3/analysis';

export const useAiStore = defineStore('ai', {
  state: () => ({
    analysis: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAnalysis(incidentId) {
      this.loading = true;
      this.error = null;
      this.analysis = null;
      
      try {
        // The mockfast.io API appears to be unstable. Reverting to local mock data for stable development.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate analysis delay

        const mockAnalyses = {
          'INC-001': 'Root Cause: Network switch failure. A faulty line card on the core router (RTR-01) is causing intermittent packet loss. Recommendation: Replace the line card and monitor network stability.',
          'INC-002': 'Root Cause: Database query inefficiency. The primary customer query is performing a full table scan, leading to high CPU usage on the DB server. Recommendation: Add an index to the `orders.customer_id` column.',
          'INC-003': 'Root Cause: Frontend JavaScript error. A null reference in the `login.js` component is preventing the UI from rendering correctly on Safari browsers. Recommendation: Add a null check before accessing the `user.profile` object.',
          'INC-004': 'Root Cause: API key expired. The API key for the payment gateway service expired on schedule. Recommendation: Rotate the API key and update the environment variables.',
          'INC-005': 'Root Cause: DNS resolution issue. The external DNS provider is experiencing a partial outage, affecting connectivity for some users. Recommendation: Failover to the secondary DNS provider.',
          'INC-006': 'Root Cause: Server resource exhaustion. The web server has run out of available memory due to a memory leak in the session management module. Recommendation: Restart the server process and investigate the memory leak.',
          'INC-007': 'Root Cause: Inefficient query. The query on the analytics table is missing a WHERE clause, causing it to return too much data. Recommendation: Add a date range to the query to limit the results.',
        };

        this.analysis = mockAnalyses[incidentId] || 'No specific analysis available for this incident.';

      } catch (error) {
        this.error = 'Failed to generate AI analysis.';
        console.error('Error generating AI analysis:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
