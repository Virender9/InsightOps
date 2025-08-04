<script setup>
import { ref } from 'vue';
import { Search, Bell, User } from 'lucide-vue-next';
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input class="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm leading-5 text-gray-700 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Search..." type="search">
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell class="h-6 w-6" />
        </button>
        <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <User class="h-6 w-6" />
        </button>
      </div>
    </div>
  </header>
</template>
