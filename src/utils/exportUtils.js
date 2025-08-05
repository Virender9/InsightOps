// Advanced Export Utilities for InsightOps Enterprise Dashboard

class ExportUtility {
  constructor() {
    this.supportedFormats = ['csv', 'json', 'xlsx', 'pdf']
  }

  // Export data to CSV format
  exportToCSV(data, filename = 'export.csv', headers = null) {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data to export')
      }

      // Auto-generate headers if not provided
      if (!headers) {
        headers = Object.keys(data[0])
      }

      // Create CSV content
      const csvHeaders = headers.join(',')
      const csvRows = data.map(row => 
        headers.map(header => {
          const value = row[header] || ''
          // Escape commas and quotes in values
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        }).join(',')
      ).join('\n')

      const csvContent = `${csvHeaders}\n${csvRows}`
      this.downloadFile(csvContent, filename, 'text/csv')
      
      return { success: true, message: `Exported ${data.length} records to CSV` }
    } catch (error) {
      console.error('CSV Export Error:', error)
      return { success: false, message: `Export failed: ${error.message}` }
    }
  }

  // Export data to JSON format
  exportToJSON(data, filename = 'export.json') {
    try {
      const jsonContent = JSON.stringify(data, null, 2)
      this.downloadFile(jsonContent, filename, 'application/json')
      
      return { success: true, message: 'Data exported to JSON successfully' }
    } catch (error) {
      console.error('JSON Export Error:', error)
      return { success: false, message: `Export failed: ${error.message}` }
    }
  }

  // Generate comprehensive dashboard report
  generateDashboardReport(dashboardData, format = 'json') {
    const reportData = {
      metadata: {
        title: 'InsightOps Dashboard Report',
        generatedAt: new Date().toISOString(),
        generatedBy: 'InsightOps Enterprise v2.0.0',
        exportFormat: format
      },
      summary: {
        totalIncidents: dashboardData.incidents?.length || 0,
        activeServers: dashboardData.servers?.filter(s => s.status === 'healthy').length || 0,
        criticalAlerts: dashboardData.alerts?.filter(a => a.severity === 'critical').length || 0,
        systemHealth: dashboardData.systemHealth || 'Unknown'
      },
      sections: {
        incidents: dashboardData.incidents || [],
        servers: dashboardData.servers || [],
        alerts: dashboardData.alerts || [],
        metrics: dashboardData.metrics || {}
      },
      insights: {
        topIncidents: this.getTopIncidents(dashboardData.incidents || []),
        serverPerformance: this.analyzeServerPerformance(dashboardData.servers || []),
        alertTrends: this.analyzeAlertTrends(dashboardData.alerts || [])
      }
    }

    const filename = `dashboard_report_${new Date().toISOString().split('T')[0]}.${format}`
    
    if (format === 'json') {
      return this.exportToJSON(reportData, filename)
    } else if (format === 'csv') {
      // Flatten data for CSV export
      const flatData = this.flattenReportData(reportData)
      return this.exportToCSV(flatData, filename.replace('.csv', '_summary.csv'))
    }
  }

  // Export incidents with advanced filtering
  exportIncidents(incidents, filters = {}, format = 'csv') {
    try {
      let filteredIncidents = [...incidents]

      // Apply filters
      if (filters.status) {
        filteredIncidents = filteredIncidents.filter(inc => inc.status === filters.status)
      }
      if (filters.priority) {
        filteredIncidents = filteredIncidents.filter(inc => inc.priority === filters.priority)
      }
      if (filters.dateRange) {
        const { start, end } = filters.dateRange
        filteredIncidents = filteredIncidents.filter(inc => {
          const incDate = new Date(inc.createdAt)
          return incDate >= new Date(start) && incDate <= new Date(end)
        })
      }

      // Prepare data for export
      const exportData = filteredIncidents.map(incident => ({
        ID: incident.id,
        Title: incident.title,
        Status: incident.status,
        Priority: incident.priority,
        'Created At': new Date(incident.createdAt).toLocaleString(),
        'Updated At': new Date(incident.updatedAt).toLocaleString(),
        Assignee: incident.assignee || 'Unassigned',
        'Affected Systems': incident.affectedSystems?.join('; ') || 'None',
        Description: incident.description || ''
      }))

      const filename = `incidents_export_${new Date().toISOString().split('T')[0]}.${format}`
      
      if (format === 'csv') {
        return this.exportToCSV(exportData, filename)
      } else if (format === 'json') {
        return this.exportToJSON(exportData, filename)
      }
      
      return { success: false, message: 'Unsupported export format' }
    } catch (error) {
      console.error('Incident Export Error:', error)
      return { success: false, message: `Export failed: ${error.message}` }
    }
  }

  // Export system metrics
  exportMetrics(metricsData, timeRange = '24h', format = 'csv') {
    try {
      const exportData = metricsData.map(metric => ({
        Timestamp: new Date(metric.timestamp).toLocaleString(),
        'CPU Usage (%)': metric.cpu || metric.cpuUsage || 0,
        'Memory Usage (%)': metric.memory || metric.memoryUsage || 0,
        'Disk I/O (MB/s)': metric.diskIO || 0,
        'Network I/O (MB/s)': metric.networkIO || 0,
        'Response Time (ms)': metric.responseTime || metric.latency || 0,
        'Active Connections': metric.connections || 0,
        'Error Rate (%)': metric.errorRate || 0
      }))

      const filename = `metrics_${timeRange}_${new Date().toISOString().split('T')[0]}.${format}`
      
      if (format === 'csv') {
        return this.exportToCSV(exportData, filename)
      } else if (format === 'json') {
        return this.exportToJSON(exportData, filename)
      }
      
      return { success: false, message: 'Unsupported export format' }
    } catch (error) {
      console.error('Metrics Export Error:', error)
      return { success: false, message: `Export failed: ${error.message}` }
    }
  }

  // Utility Methods
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(url)
  }

  getTopIncidents(incidents) {
    return incidents
      .filter(inc => inc.priority === 'critical' || inc.priority === 'high')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(inc => ({
        id: inc.id,
        title: inc.title,
        priority: inc.priority,
        status: inc.status,
        duration: this.calculateDuration(inc.createdAt)
      }))
  }

  analyzeServerPerformance(servers) {
    if (!servers.length) return {}
    
    const totalServers = servers.length
    const healthyServers = servers.filter(s => s.status === 'healthy').length
    const avgCpu = servers.reduce((sum, s) => sum + (s.cpu || 0), 0) / totalServers
    const avgMemory = servers.reduce((sum, s) => sum + (s.memory || 0), 0) / totalServers
    
    return {
      totalServers,
      healthyServers,
      healthPercentage: ((healthyServers / totalServers) * 100).toFixed(1),
      avgCpuUsage: avgCpu.toFixed(1),
      avgMemoryUsage: avgMemory.toFixed(1)
    }
  }

  analyzeAlertTrends(alerts) {
    if (!alerts.length) return {}
    
    const severityCount = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1
      return acc
    }, {})
    
    const last24h = alerts.filter(alert => {
      const alertTime = new Date(alert.timestamp)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return alertTime >= dayAgo
    }).length
    
    return {
      totalAlerts: alerts.length,
      severityBreakdown: severityCount,
      alertsLast24h: last24h,
      mostCommonSeverity: Object.keys(severityCount).reduce((a, b) => 
        severityCount[a] > severityCount[b] ? a : b
      )
    }
  }

  flattenReportData(reportData) {
    return [
      {
        Section: 'Summary',
        Metric: 'Total Incidents',
        Value: reportData.summary.totalIncidents
      },
      {
        Section: 'Summary', 
        Metric: 'Active Servers',
        Value: reportData.summary.activeServers
      },
      {
        Section: 'Summary',
        Metric: 'Critical Alerts', 
        Value: reportData.summary.criticalAlerts
      },
      {
        Section: 'Summary',
        Metric: 'System Health',
        Value: reportData.summary.systemHealth
      }
    ]
  }

  calculateDuration(createdAt) {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMs = now - created
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    return `${hours}h`
  }

  // Batch export multiple datasets
  async batchExport(datasets, format = 'zip') {
    try {
      const exports = []
      
      for (const dataset of datasets) {
        const { name, data, type } = dataset
        let result
        
        switch (type) {
          case 'incidents':
            result = this.exportIncidents(data, {}, 'json')
            break
          case 'metrics':
            result = this.exportMetrics(data, '24h', 'json')
            break
          default:
            result = this.exportToJSON(data, `${name}.json`)
        }
        
        if (result.success) {
          exports.push({ name, status: 'success' })
        } else {
          exports.push({ name, status: 'failed', error: result.message })
        }
      }
      
      return {
        success: true,
        message: `Batch export completed: ${exports.length} files processed`,
        details: exports
      }
    } catch (error) {
      console.error('Batch Export Error:', error)
      return { success: false, message: `Batch export failed: ${error.message}` }
    }
  }
}

// Export singleton instance
export const exportUtils = new ExportUtility()
