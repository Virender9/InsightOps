<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale);

const props = defineProps({
  title: String,
  data: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  unit: {
    type: String,
    default: ''
  }
});

const chartRef = ref(null);

const chartData = computed(() => ({
  datasets: [{
    label: props.title,
    data: props.data,
    borderColor: props.color,
    backgroundColor: props.color + '20',
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6,
    borderWidth: 3,
  }]
}));

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: props.title,
      color: '#374151',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: props.color,
      borderWidth: 1,
      callbacks: {
        label: (context) => `${context.parsed.y}${props.unit}`
      }
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        displayFormats: {
          minute: 'HH:mm',
          hour: 'HH:mm'
        }
      },
      grid: {
        color: '#e5e7eb',
        drawBorder: false
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#e5e7eb',
        drawBorder: false
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12
        },
        callback: (value) => `${value}${props.unit}`
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  elements: {
    point: {
      hoverBackgroundColor: props.color
    }
  }
}));

// Auto-resize chart when container changes
let resizeObserver;
onMounted(() => {
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (chartRef.value?.chart) {
        chartRef.value.chart.resize();
      }
    });
    resizeObserver.observe(chartRef.value.$el);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <div class="h-64 w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4">
    <Line ref="chartRef" :data="chartData" :options="options" />
  </div>
</template>
