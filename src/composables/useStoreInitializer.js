import { onMounted } from 'vue'
import { useAlertsStore } from '@/stores/alerts'
import { useMetricsStore } from '@/stores/metrics'
import { useIncidentsStore } from '@/stores/incidents'
import { useHealthStore } from '@/stores/health'

export function useStoreInitializer() {
  const alertsStore = useAlertsStore()
  const metricsStore = useMetricsStore()
  const incidentsStore = useIncidentsStore()
  const healthStore = useHealthStore()

  const initializeStores = async () => {
    try {
      console.log('🔄 Initializing all stores...')
      
      // Initialize stores with fallback data
      const promises = []
      
      if (alertsStore.fetchAlerts) {
        promises.push(alertsStore.fetchAlerts().catch(err => {
          console.warn('Alerts store failed, using mock data:', err)
        }))
      }
      
      if (metricsStore.fetchMetrics) {
        promises.push(metricsStore.fetchMetrics().catch(err => {
          console.warn('Metrics store failed, using mock data:', err)
        }))
      }
      
      if (incidentsStore.fetchIncidents) {
        promises.push(incidentsStore.fetchIncidents().catch(err => {
          console.warn('Incidents store failed, using mock data:', err)
        }))
      }
      
      if (healthStore.fetchHealthData) {
        promises.push(healthStore.fetchHealthData().catch(err => {
          console.warn('Health store failed, using mock data:', err)
        }))
      }
      
      await Promise.allSettled(promises)
      
      console.log('✅ Store initialization completed')
    } catch (error) {
      console.error('❌ Store initialization failed:', error)
    }
  }

  return {
    initializeStores,
    stores: {
      alertsStore,
      metricsStore,
      incidentsStore,
      healthStore
    }
  }
}
