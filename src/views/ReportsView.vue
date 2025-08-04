<script setup>
import { ref } from 'vue';
import { useIncidentsStore } from '@/stores/incidents';
import { useHealthStore } from '@/stores/health';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-vue-next';

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
  <div>
    <h1 class="text-3xl font-bold text-gray-800">Reports</h1>
    <p class="mt-4 text-gray-600">Generate a customized report of incidents and system health.</p>

    <div class="mt-8 p-6 bg-white rounded-lg shadow-sm border space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label for="report-type" class="block text-sm font-medium text-gray-700">Report Type</label>
          <select id="report-type" v-model="reportType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="comprehensive">Comprehensive Report</option>
            <option value="incidents">Incident Summary</option>
            <option value="health">System Health</option>
          </select>
        </div>
        <div>
          <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" id="start-date" v-model="startDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" id="end-date" v-model="endDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
      </div>
      <button 
        @click="generateReport"
        :disabled="generating"
        class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <Download class="-ml-1 mr-2 h-5 w-5" />
        {{ generating ? 'Generating...' : 'Generate PDF Report' }}
      </button>
    </div>
  </div>
</template>
