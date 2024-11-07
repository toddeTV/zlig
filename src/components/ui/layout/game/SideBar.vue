<script setup lang="ts">
import { ref } from 'vue'
import DebugMenu from './debug/DebugMenu.vue'

const hasDebug = ref(true)
</script>

<template>
  <div class="bg-white h-full flex flex-col gap-1">
    <div class="flex-grow" />

    <hr>

    <DebugMenu v-if="hasDebug" />

    <div class="text-gray-600 text-sm p-2 flex justify-between">
      <span>&copy; {{ new Date().getFullYear() }} The zlig authors</span>

      <span># TODO: version</span>
    </div>
  </div>
</template>
