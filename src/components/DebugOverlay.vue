<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import useVirtualTimeStore from '@/composables/useVirtualTimeStore'
import { storeToRefs } from 'pinia'

const { showCameraHelper, showFog, showLightHelper, showWaterShader } = storeToRefs(useDebugStore())
const { currentVirtualTime } = storeToRefs(useVirtualTimeStore())

function formatTime(date: Date) {
  return date.toISOString().slice(11, 19)
}
</script>

<template>
  <div class="absolute -top-1 -right-1 z-20 flex flex-col gap-0.5 bg-white py-1.5 pl-2.5 pr-3.5 border border-black">
    <h2 class="font-semibold">
      Debug
    </h2>

    <div class="group">
      <span>Virtual Time:</span>
      <span class="ml-2">{{ formatTime(currentVirtualTime) }}</span>
    </div>

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

    <div class="group">
      <input
        id="showWaterShader"
        v-model="showWaterShader"
        class="cursor-pointer"
        type="checkbox"
      >
      <label
        class="cursor-pointer group-hover:text-blue-400 select-none ml-1"
        for="showWaterShader"
      >show water shader</label>
    </div>
  </div>
</template>

<style scoped>
</style>
