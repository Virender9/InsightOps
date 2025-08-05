<template>
  <div class="text-center">
    <div :class="color" class="text-2xl font-bold">{{ value }}</div>
    <div class="text-xs text-gray-500 mb-1">{{ label }}</div>
    <div v-if="trend" class="flex items-center justify-center space-x-1">
      <TrendingUp v-if="trend > 0" class="w-3 h-3 text-green-500" />
      <TrendingDown v-else-if="trend < 0" class="w-3 h-3 text-red-500" />
      <Minus v-else class="w-3 h-3 text-gray-400" />
      <span :class="getTrendColor(trend)" class="text-xs font-medium">
        {{ formatTrend(trend) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'text-gray-900'
  },
  trend: {
    type: Number,
    default: null
  }
})

const getTrendColor = (trend) => {
  if (trend > 0) return 'text-green-600'
  if (trend < 0) return 'text-red-600'
  return 'text-gray-500'
}

const formatTrend = (trend) => {
  if (trend === 0) return '0%'
  const sign = trend > 0 ? '+' : ''
  return `${sign}${trend}%`
}
</script>
