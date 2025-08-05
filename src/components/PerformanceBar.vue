<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span :class="getValueColor()" class="text-sm font-semibold">{{ value }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div 
        :class="getBarColor()" 
        class="h-2 rounded-full transition-all duration-300 ease-in-out"
        :style="{ width: `${Math.min(value, 100)}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  threshold: {
    type: Number,
    default: 80
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const getValueColor = () => {
  if (props.value >= props.threshold) return 'text-red-600'
  if (props.value >= props.threshold * 0.8) return 'text-yellow-600'
  return 'text-green-600'
}

const getBarColor = () => {
  if (props.value >= props.threshold) return 'bg-red-500'
  if (props.value >= props.threshold * 0.8) return 'bg-yellow-500'
  
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }
  
  return colors[props.color] || 'bg-blue-500'
}
</script>
