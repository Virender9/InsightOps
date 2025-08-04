<script setup>
import { defineProps, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});

const data = computed(() => {
  const priorities = { 'High': 0, 'Medium': 0, 'Low': 0 };
  props.chartData.forEach(incident => {
    if (priorities[incident.priority] !== undefined) {
      priorities[incident.priority]++;
    }
  });

  return {
    labels: Object.keys(priorities),
    datasets: [
      {
        label: 'Incidents by Priority',
        backgroundColor: ['#ef4444', '#f97316', '#3b82f6'],
        data: Object.values(priorities),
      },
    ],
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      }
    },
  },
};
</script>

<template>
  <div class="h-72 p-4 bg-white rounded-lg shadow-sm border">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Incident Priority Distribution</h3>
    <Bar :data="data" :options="options" />
  </div>
</template>
