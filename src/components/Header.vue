<script setup>
import { ref } from 'vue';
import { User } from 'lucide-vue-next';
import GlobalSearch from './GlobalSearch.vue';
import NotificationCenter from './NotificationCenter.vue';

const handleSearchSelect = (result) => {
  console.log('Selected search result:', result)
}
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center w-96">
        <GlobalSearch @select="handleSearchSelect" placeholder="Search incidents, servers, alerts..." />
      </div>
      <div class="flex items-center space-x-4">
        <NotificationCenter />
        <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <User class="h-6 w-6" />
        </button>
      </div>
    </div>
  </header>
</template>
