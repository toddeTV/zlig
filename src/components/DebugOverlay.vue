<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import { storeToRefs } from 'pinia'

const { showCameraHelper, showFog, showLightHelper } = storeToRefs(useDebugStore())
</script>

<template>
  <div class="absolute -top-1 -right-1 z-20 flex flex-col gap-0.5 bg-white py-1 px-2 border border-black">
    <h2>Debug Overlay</h2>

    <div class="group">
      <input
        id="showLightHelper"
        v-model="showLightHelper"
        class="cursor-pointer"
        type="checkbox"
      >
      <label
        class="cursor-pointer group-hover:text-blue-400 select-none ml-1"
        for="showLightHelper"
      >show Lights Helper</label>
    </div>

    <div class="group">
      <input
        id="showCameraHelper"
        v-model="showCameraHelper"
        class="cursor-pointer"
        type="checkbox"
      >
      <label
        class="cursor-pointer group-hover:text-blue-400 select-none ml-1"
        for="showCameraHelper"
      >show Camera Helper</label>
    </div>

    <div class="group">
      <input
        id="showFog"
        v-model="showFog"
        class="cursor-pointer"
        type="checkbox"
      >
      <label
        class="cursor-pointer group-hover:text-blue-400 select-none ml-1"
        for="showFog"
      >show fog</label>
    </div>
  </div>
</template>

<style scoped>
</style>
