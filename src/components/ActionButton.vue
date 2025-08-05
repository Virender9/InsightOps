<template>
  <button
    @click="$emit('click')"
    :class="getButtonClass()"
    class="w-full p-3 rounded-lg border text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    <div class="flex flex-col items-center space-y-2">
      <component :is="iconComponent" class="w-5 h-5" />
      <span>{{ label }}</span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  Settings,
  Zap,
  Shield
} from 'lucide-vue-next'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'gray'
  }
})

defineEmits(['click'])

const iconComponent = computed(() => {
  const icons = {
    AlertTriangle,
    Activity,
    BarChart3,
    Settings,
    Zap,
    Shield
  }
  return icons[props.icon] || Settings
})

const getButtonClass = () => {
  const colors = {
    red: 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100',
    blue: 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100',
    green: 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100',
    gray: 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100'
  }
  return colors[props.color] || colors.gray
}
</script>
