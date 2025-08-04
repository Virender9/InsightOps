<script setup>
import { defineProps } from 'vue';

defineProps({
  title: String,
  value: String,
  icon: Object,
});
</script>

<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
      </div>
      <div class="rounded-full bg-blue-100 p-3">
        <component :is="icon" class="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
</template>
