<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <Header />
      <main class="flex-1 overflow-y-auto bg-gray-100 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* Additional global styles if needed */
</style>
