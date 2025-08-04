<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  value: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    default: 100
  },
  unit: {
    type: String,
    default: '%'
  },
  thresholds: {
    type: Object,
    default: () => ({
      good: 50,
      warning: 80,
      critical: 90
    })
  }
});

const percentage = computed(() => Math.min((props.value / props.max) * 100, 100));

const status = computed(() => {
  if (props.value >= props.thresholds.critical) return 'critical';
  if (props.value >= props.thresholds.warning) return 'warning';
  if (props.value >= props.thresholds.good) return 'caution';
  return 'good';
});

const statusColors = computed(() => {
  const colors = {
    good: {
      bg: 'from-green-400 to-emerald-500',
      text: 'text-green-700',
      glow: 'shadow-green-500/30'
    },
    caution: {
      bg: 'from-blue-400 to-cyan-500', 
      text: 'text-blue-700',
      glow: 'shadow-blue-500/30'
    },
    warning: {
      bg: 'from-yellow-400 to-orange-500',
      text: 'text-orange-700',
      glow: 'shadow-orange-500/30'
    },
    critical: {
      bg: 'from-red-400 to-red-600',
      text: 'text-red-700',
      glow: 'shadow-red-500/30'
    }
  };
  return colors[status.value];
});

const circumference = 2 * Math.PI * 45; // radius = 45
const strokeDasharray = computed(() => `${(percentage.value / 100) * circumference} ${circumference}`);
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ title }}</h3>
    
    <div class="relative">
      <!-- Background circle -->
      <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50" 
          r="45"
          stroke="#e5e7eb"
          stroke-width="8"
          fill="none"
        />
        <!-- Progress circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          :stroke="`url(#gradient-${status})`"
          stroke-width="8"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="strokeDasharray"
          stroke-dashoffset="0"
          class="transition-all duration-1000 ease-in-out"
          :class="statusColors.glow"
          style="filter: drop-shadow(0 0 8px currentColor);"
        />
        
        <!-- Gradient definitions -->
        <defs>
          <linearGradient :id="`gradient-${status}`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="status === 'good' ? '#10b981' : status === 'caution' ? '#3b82f6' : status === 'warning' ? '#f59e0b' : '#ef4444'" />
            <stop offset="100%" :stop-color="status === 'good' ? '#059669' : status === 'caution' ? '#1d4ed8' : status === 'warning' ? '#d97706' : '#dc2626'" />
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Center value -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="text-2xl font-bold" :class="statusColors.text">
            {{ Math.round(value) }}{{ unit }}
          </div>
          <div class="text-xs text-gray-500 capitalize">
            {{ status }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status indicator -->
    <div class="mt-4 flex items-center space-x-2">
      <div 
        class="w-3 h-3 rounded-full bg-gradient-to-r shadow-lg"
        :class="[statusColors.bg, statusColors.glow]"
      ></div>
      <span class="text-sm font-medium" :class="statusColors.text">
        {{ status.charAt(0).toUpperCase() + status.slice(1) }} Performance
      </span>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 8px currentColor);
  }
  50% {
    filter: drop-shadow(0 0 16px currentColor);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
</style>
