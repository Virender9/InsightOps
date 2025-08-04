<script setup>
import { ref } from 'vue';
import { LayoutDashboard, ShieldAlert, Activity, BarChart, Settings, LifeBuoy } from 'lucide-vue-next';

const menuItems = ref([
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Incidents', icon: ShieldAlert, path: '/incidents' },
  { name: 'System Health', icon: Activity, path: '/health' },
  { name: 'Reports', icon: BarChart, path: '/reports' },
]);

const bottomMenuItems = ref([
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Support', icon: LifeBuoy, path: '/support' },
]);
</script>

<template>
  <aside class="flex h-screen w-64 flex-col overflow-y-auto border-r bg-gray-900 px-5 py-8">
    <a href="#">
      <h1 class="text-2xl font-bold text-white">InsightOps</h1>
    </a>
    <div class="mt-6 flex flex-1 flex-col justify-between">
      <nav class="-mx-3 space-y-6 ">
        <div class="space-y-3 ">
          <label class="px-3 text-xs font-semibold uppercase text-gray-400">Analytics</label>
          <router-link v-for="item in menuItems" :key="item.name" :to="item.path" class="flex transform items-center rounded-lg px-3 py-2 text-gray-300 transition-colors duration-300 hover:bg-gray-800 hover:text-gray-200" active-class="bg-gray-700 text-white">
            <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
            <span class="mx-2 text-sm font-medium">{{ item.name }}</span>
          </router-link>
        </div>
        
        <div class="space-y-3 ">
          <label class="px-3 text-xs font-semibold uppercase text-gray-400">Customization</label>
          <router-link v-for="item in bottomMenuItems" :key="item.name" :to="item.path" class="flex transform items-center rounded-lg px-3 py-2 text-gray-300 transition-colors duration-300 hover:bg-gray-800 hover:text-gray-200" active-class="bg-gray-700 text-white">
            <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
            <span class="mx-2 text-sm font-medium">{{ item.name }}</span>
          </router-link>
        </div>
      </nav>
    </div>
  </aside>
</template>
