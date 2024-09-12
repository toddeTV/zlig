<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import { storeToRefs } from 'pinia'

const { isDebugCamera, isDebugFog, isDebugLights } = storeToRefs(useDebugStore())
</script>

<template>
  <div class="absolute -top-1 -right-1 z-20 flex flex-col gap-0.5 bg-white py-1 px-2 border border-black">
    <h2>Debug Overlay</h2>

    <div class="group">
      <input
        id="debugLights"
        v-model="isDebugLights"
        class="cursor-pointer"
        type="checkbox"
      >
      <label
        class="cursor-pointer group-hover:text-blue-400 select-none ml-1"
        for="debugLights"
      >show Lights Helper</label>
    </div>

    <div class="group">
      <input
        id="debugCamera"
        v-model="isDebugCamera"
        class="cursor-pointer"
        type="checkbox"
      >
      <label
        class="cursor-pointer group-hover:text-blue-400 select-none ml-1"
        for="debugCamera"
      >show Camera Helper</label>
    </div>

    <div class="group">
      <input
        id="debugFog"
        v-model="isDebugFog"
        class="cursor-pointer"
        type="checkbox"
      >
      <label
        class="cursor-pointer group-hover:text-blue-400 select-none ml-1"
        for="debugFog"
      >show fog</label>
    </div>
  </div>
</template>

<style scoped>
</style>
