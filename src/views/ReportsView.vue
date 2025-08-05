<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
            <div class="flex items-center space-x-2">
              <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              <span class="text-sm text-gray-600">{{ reports.length }} Reports Generated</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <select v-model="selectedPeriod" class="text-sm border-gray-300 rounded-md">
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <div class="relative">
              <button 
                @click="showExportMenu = !showExportMenu"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export All
                <svg class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Export Menu -->
              <div v-if="showExportMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <button @click="exportAllData('csv')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Export as CSV
                  </button>
                  <button @click="exportAllData('json')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Export as JSON
                  </button>
                  <button @click="exportDashboardReport()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Full Dashboard Report
                  </button>
                  <button @click="exportIncidentsData()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Incidents Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-blue-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Reports</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ reports.length }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-green-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Generated Today</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ generatedToday }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-yellow-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Processing</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ processingReports }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center p-3 rounded-md bg-purple-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Downloads</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ totalDownloads }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Types -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="reportType in reportTypes" 
          :key="reportType.id"
          class="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="generateReport(reportType)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div :class="[
                  'inline-flex items-center justify-center p-2 rounded-md',
                  reportType.color
                ]">
                  <component :is="reportType.icon" class="h-5 w-5 text-white" />
                </div>
                <h3 class="text-lg font-medium text-gray-900">{{ reportType.name }}</h3>
              </div>
              <p class="text-gray-600 text-sm mb-4">{{ reportType.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Last generated: {{ reportType.lastGenerated }}</span>
                <button :class="[
                  'inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white transition-colors',
                  reportType.color.replace('bg-', 'bg-').replace('-500', '-600'),
                  reportType.color.replace('bg-', 'hover:bg-').replace('-500', '-700')
                ]">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports Table -->
      <div class="bg-white rounded-lg shadow border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Recent Reports</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div :class="[
                        'inline-flex items-center justify-center h-8 w-8 rounded',
                        getReportTypeColor(report.type)
                      ]">
                        <component :is="getReportIcon(report.type)" class="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ report.name }}</div>
                      <div class="text-sm text-gray-500">{{ report.period }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900 capitalize">{{ report.type }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(report.generatedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    report.status === 'ready' ? 'bg-green-100 text-green-800' :
                    report.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.size }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button 
                      v-if="report.status === 'ready'"
                      @click="downloadReport(report)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Download
                    </button>
                    <button @click="viewReport(report)" class="text-gray-600 hover:text-gray-900">
                      View
                    </button>
                    <button @click="deleteReport(report)" class="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { BarChart3, Shield, Clock, Activity } from 'lucide-vue-next'
// Remove problematic imports that cause template compilation errors
// import { exportUtils } from '@/utils/exportUtils'
// import { dataService } from '@/services/dataService'

const selectedPeriod = ref('30d')
const showExportMenu = ref(false)
const isExporting = ref(false)

const reportTypes = ref([
  {
    id: 'performance',
    name: 'Performance Report',
    description: 'System performance metrics, resource utilization, and response times',
    color: 'bg-blue-500',
    icon: 'performance',
    lastGenerated: '2 hours ago'
  },
  {
    id: 'security',
    name: 'Security Audit',
    description: 'Security incidents, vulnerabilities, and compliance status',
    color: 'bg-red-500',
    icon: 'ShieldCheckIcon',
    lastGenerated: '1 day ago'
  },
  {
    id: 'availability',
    name: 'Availability Report',
    description: 'System uptime, downtime incidents, and SLA compliance',
    color: 'bg-green-500',
    icon: 'ClockIcon',
    lastGenerated: '6 hours ago'
  },
  {
    id: 'capacity',
    name: 'Capacity Planning',
    description: 'Resource usage trends and capacity forecasting',
    color: 'bg-purple-500',
    icon: 'TrendingUpIcon',
    lastGenerated: '3 days ago'
  },
  {
    id: 'incidents',
    name: 'Incident Summary',
    description: 'Incident analysis, resolution times, and patterns',
    color: 'bg-yellow-500',
    icon: 'ExclamationTriangleIcon',
    lastGenerated: '12 hours ago'
  },
  {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Regulatory compliance status and audit trails',
    color: 'bg-indigo-500',
    icon: 'DocumentCheckIcon',
    lastGenerated: '1 week ago'
  }
])

const reports = ref([
  {
    id: 1,
    name: 'Weekly Performance Summary',
    type: 'performance',
    period: 'Last 7 days',
    generatedAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'ready',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Security Audit Report',
    type: 'security',
    period: 'Last 30 days',
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'ready',
    size: '1.8 MB'
  },
  {
    id: 3,
    name: 'Monthly Availability Report',
    type: 'availability',
    period: 'Last 30 days',
    generatedAt: new Date(Date.now() - 21600000).toISOString(),
    status: 'processing',
    size: '-'
  }
])

const generatedToday = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return reports.value.filter(report => {
    const reportDate = new Date(report.generatedAt)
    return reportDate >= today
  }).length
})

const processingReports = computed(() => {
  return reports.value.filter(report => report.status === 'processing').length
})

const totalDownloads = computed(() => {
  return reports.value.filter(report => report.status === 'ready').length * 15 // Mock download count
})

// Icon components (simplified)
const ChartBarIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' }
const ShieldCheckIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>' }
const ClockIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }

const getReportTypeColor = (type) => {
  const typeMap = {
    performance: 'bg-blue-500',
    security: 'bg-red-500',
    availability: 'bg-green-500',
    capacity: 'bg-purple-500',
    incidents: 'bg-yellow-500',
    compliance: 'bg-indigo-500'
  }
  return typeMap[type] || 'bg-gray-500'
}

const getReportIcon = (type) => {
  const iconMap = {
    performance: BarChart3,
    security: Shield,
    availability: Clock,
    compliance: Activity
  }
  return iconMap[type] || BarChart3
}

const generateReport = (reportType) => {
  console.log('Generating report:', reportType.name)
  // Show loading state
  const newReport = {
    id: reports.value.length + 1,
    name: `${reportType.name} - ${new Date().toLocaleDateString()}`,
    type: reportType.id,
    period: selectedPeriod.value === '7d' ? 'Last 7 days' : selectedPeriod.value === '30d' ? 'Last 30 days' : 'Last 90 days',
    generatedAt: new Date().toISOString(),
    status: 'processing',
    size: '-'
  }
  
  reports.value.unshift(newReport)
  
  // Simulate report generation
  setTimeout(() => {
    newReport.status = 'ready'
    newReport.size = `${(Math.random() * 5 + 0.5).toFixed(1)} MB`
  }, 3000)
}

const downloadReport = (report) => {
  console.log('Downloading report:', report.name)
  // Create a mock download
  const element = document.createElement('a')
  const file = new Blob([`Mock Report Content for ${report.name}\n\nGenerated: ${report.generatedAt}\nType: ${report.type}\nPeriod: ${report.period}`], 
    {type: 'text/plain'})
  element.href = URL.createObjectURL(file)
  element.download = `${report.name.replace(/\s+/g, '_')}.txt`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const viewReport = (report) => {
  alert(`Viewing report: ${report.name}\n\nThis would open the report details in a modal or new page.`)
}

const deleteReport = (report) => {
  if (confirm(`Are you sure you want to delete "${report.name}"?`)) {
    const index = reports.value.findIndex(r => r.id === report.id)
    if (index > -1) {
      reports.value.splice(index, 1)
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// Export Functions
const exportAllData = async (format) => {
  try {
    isExporting.value = true
    showExportMenu.value = false
    
    const result = exportUtils.exportToCSV(reports.value, `all_reports_${new Date().toISOString().split('T')[0]}.${format}`)
    
    if (result.success) {
      alert(`✅ Export successful! ${result.message}`)
    } else {
      alert(`❌ Export failed: ${result.message}`)
    }
  } catch (error) {
    alert(`❌ Export error: ${error.message}`)
  } finally {
    isExporting.value = false
  }
}

const exportDashboardReport = async () => {
  try {
    isExporting.value = true
    showExportMenu.value = false
    
    // Fetch all dashboard data
    const [incidents, servers, alerts] = await Promise.all([
      dataService.getIncidents().catch(() => ({ data: [] })),
      dataService.getServers().catch(() => ({ data: [] })),
      dataService.getAlerts().catch(() => ({ data: [] }))
    ])
    
    const dashboardData = {
      incidents: incidents.data,
      servers: servers.data,
      alerts: alerts.data,
      systemHealth: 'Healthy'
    }
    
    const result = exportUtils.generateDashboardReport(dashboardData, 'json')
    
    if (result.success) {
      alert(`✅ Dashboard report exported! ${result.message}`)
    } else {
      alert(`❌ Export failed: ${result.message}`)
    }
  } catch (error) {
    alert(`❌ Export error: ${error.message}`)
  } finally {
    isExporting.value = false
  }
}

const exportIncidentsData = async () => {
  try {
    isExporting.value = true
    showExportMenu.value = false
    
    const incidents = await dataService.getIncidents()
    const result = exportUtils.exportIncidents(incidents.data, {}, 'csv')
    
    if (result.success) {
      alert(`✅ Incidents exported! ${result.message}`)
    } else {
      alert(`❌ Export failed: ${result.message}`)
    }
  } catch (error) {
    alert(`❌ Export error: ${error.message}`)
  } finally {
    isExporting.value = false
  }
}
</script>
