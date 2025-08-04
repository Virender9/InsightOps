<script setup>
import { ref, computed } from 'vue';
import { useIncidentsStore } from '@/stores/incidents';
import { useHealthStore } from '@/stores/health';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, FileText, AlertTriangle, Activity, Calendar, BarChart3, Clock, Filter, Info } from 'lucide-vue-next';

const incidentsStore = useIncidentsStore();
const healthStore = useHealthStore();
const generating = ref(false);
const reportType = ref('comprehensive');
const startDate = ref('');
const endDate = ref('');

const generateReport = async () => {
  if (!reportType.value) {
    alert('Please select a report type.');
    return;
  }

  // Basic date validation
  if (startDate.value && endDate.value && new Date(startDate.value) > new Date(endDate.value)) {
    alert('Start date cannot be after end date.');
    return;
  }

  generating.value = true;

  // Ensure we have the latest data
  await Promise.all([
    incidentsStore.fetchIncidents(),
    healthStore.fetchHealthMetrics(),
  ]);

  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.text('InsightOps Performance Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    let lastY = 35;

  // Add date range to title if selected
  if (startDate.value && endDate.value) {
    doc.setFontSize(10);
    doc.text(`Date Range: ${startDate.value} to ${endDate.value}`, 14, 35);
    lastY = 40;
  }

    if (reportType.value === 'comprehensive' || reportType.value === 'incidents') {
    let filteredIncidents = incidentsStore.incidents;

    // Filter incidents by date range if selected. 
    // Filter incidents by date range if selected.
    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      end.setDate(end.getDate() + 1); // Make the end date inclusive

      filteredIncidents = incidentsStore.incidents.filter(i => {
        if (!i.createdAt) return false; // Ignore incidents without a date
        const incidentDate = new Date(i.createdAt);
        return incidentDate >= start && incidentDate < end;
      });
    }

    doc.setFontSize(16);
    doc.text('Incident Summary', 14, lastY + 10);
    doc.autoTable({
      startY: lastY + 15,
      head: [['ID', 'Category', 'Priority', 'Status']],
      body: filteredIncidents.map(i => [i.id, i.category, i.priority, i.status]),
      theme: 'striped',
    });
    lastY = doc.autoTable.previous.finalY;
  }

    if (reportType.value === 'comprehensive' || reportType.value === 'health') {
    doc.setFontSize(16);
    doc.text('System Health Snapshot', 14, lastY + 15);
        doc.autoTable({
      startY: lastY + 20,
      head: [['Metric', 'Current Value']],
      body: [
        ['CPU Usage', `${healthStore.metrics.cpuUsage}%`],
        ['Memory Usage', `${healthStore.metrics.memoryUsage}%`],
        ['Disk I/O', `${healthStore.metrics.diskIO} MB/s`],
        ['Latency', `${healthStore.metrics.latency}ms`],
      ],
      theme: 'grid',
    });
  }

  doc.save('InsightOps_Report.pdf');
  generating.value = false;
};
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center">
        <FileText class="h-8 w-8 text-indigo-600 mr-3" />
        <h1 class="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
      </div>
      <p class="mt-2 text-gray-600">Generate comprehensive reports on incidents and system health metrics.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Report Configuration Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <Filter class="h-5 w-5 text-indigo-500 mr-2" />
              Report Configuration
            </h2>
          </div>
          <div class="p-6 space-y-6">
            <div>
              <label for="report-type" class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText class="h-4 w-4 text-gray-400" />
                </div>
                <select 
                  id="report-type" 
                  v-model="reportType" 
                  class="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="comprehensive">Comprehensive Report</option>
                  <option value="incidents">Incident Summary</option>
                  <option value="health">System Health</option>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center text-sm text-gray-500">
                <Calendar class="h-4 w-4 mr-2 text-gray-400" />
                <span>Date Range</span>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label for="start-date" class="sr-only">Start Date</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      id="start-date" 
                      v-model="startDate" 
                      class="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Start date"
                    />
                  </div>
                </div>
                <div>
                  <label for="end-date" class="sr-only">End Date</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      id="end-date" 
                      v-model="endDate" 
                      class="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              @click="generateReport"
              :disabled="generating"
              class="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Download class="h-5 w-5 mr-2" />
              {{ generating ? 'Generating Report...' : 'Generate Report' }}
            </button>

            <div class="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700 flex items-start">
              <Info class="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Select a date range to filter the report data. Leave empty to include all records.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Preview -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 class="h-5 w-5 text-indigo-500 mr-2" />
              Report Preview
            </h2>
          </div>
          <div class="p-6">
            <div class="text-center py-12 px-4 sm:px-6 lg:px-8">
              <Activity class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-lg font-medium text-gray-900">Report Preview</h3>
              <p class="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                Configure your report settings and generate a preview. The actual report will include detailed data based on your selection.
              </p>
              <div class="mt-6">
                <div class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Clock class="h-5 w-5 text-gray-500 mr-2" />
                  Last generated: Just now
                </div>
              </div>
            </div>

            <!-- Report Summary Stats -->
            <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Incidents Card -->
              <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div class="px-4 py-5 sm:p-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <AlertTriangle class="h-6 w-6 text-white" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Total Incidents</dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-gray-900">24</div>
                          <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <span class="sr-only">Increased by</span>12%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- System Health Card -->
              <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div class="px-4 py-5 sm:p-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <Activity class="h-6 w-6 text-white" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">System Health</dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-gray-900">98%</div>
                          <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <span class="sr-only">Stable</span>Stable
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Response Time Card -->
              <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div class="px-4 py-5 sm:p-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <Clock class="h-6 w-6 text-white" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Avg. Response</dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-gray-900">24m</div>
                          <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                            <span class="sr-only">Increased by</span>5m
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
