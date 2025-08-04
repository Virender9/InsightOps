<script setup>
import { watch } from 'vue';
import { useAiStore } from '@/stores/ai';
import { storeToRefs } from 'pinia';
import { X, LoaderCircle, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  incident: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const aiStore = useAiStore();
const { analysis, loading: aiLoading, error: aiError } = storeToRefs(aiStore);

watch(() => props.show, (newVal) => {
  if (newVal && props.incident) {
    aiStore.fetchAnalysis(props.incident.id);
  }
});


</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="relative w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl transform transition-all scale-95 opacity-0 animate-fade-in-scale">
      <button @click="emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X class="h-6 w-6" />
      </button>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ incident.title }}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p class="text-sm font-medium text-gray-500">Category</p>
          <p class="text-lg text-gray-800">{{ incident.category }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Priority</p>
          <p class="text-lg text-gray-800">{{ incident.priority }}</p>
        </div>
        
      </div>

      <div class="mb-6">
        <p class="text-sm font-medium text-gray-500">Description</p>
        <p class="text-gray-700">{{ incident.description }}</p>
      </div>

      <!-- AI Analysis Section -->
            <!-- AI Analysis Section -->
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
        <div v-if="aiLoading" class="flex items-center text-gray-600">
          <LoaderCircle class="h-5 w-5 animate-spin mr-2" />
          <span>Generating analysis...</span>
        </div>
        <div v-else-if="aiError" class="flex items-center text-red-600">
          <AlertTriangle class="h-5 w-5 mr-2" />
          <span>{{ aiError }}</span>
        </div>
        <div v-else-if="analysis">
          <p class="text-gray-700">{{ analysis }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-scale {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-fade-in-scale {
  animation: fade-in-scale 0.3s ease-out forwards;
}
</style>
