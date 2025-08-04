<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale);

const props = defineProps({
  title: String,
  chartData: Array,
  color: { 
    type: String, 
    default: '#3b82f6' 
  },
});

const data = computed(() => ({
  labels: props.chartData.map((_, index) => `T-${props.chartData.length - index}`), // Simple time labels
  datasets: [
    {
      label: props.title,
      backgroundColor: props.color,
      borderColor: props.color,
      data: props.chartData,
      tension: 0.4,
      pointRadius: 2,
      borderWidth: 2,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    <div class="h-64">
      <Line :data="data" :options="options" />
    </div>
  </div>
</template>
