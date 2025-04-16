<template>
  <div class="relative flex min-h-screen bg-gray-50">
    <Sidebar />

    <main class="flex-1 px-4 sm:px-6 md:px-8 py-6 transition-all duration-300 ease-in-out">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>
