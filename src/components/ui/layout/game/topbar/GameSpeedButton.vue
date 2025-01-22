<script setup lang="ts">
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'

const props = defineProps<{
  targetFactor: number
  class: string
}>()

const gameTime = useGameTimeStore()
</script>

<template>
  <button @click="gameTime.currentFactor = targetFactor">
    <span :class="props.class" :data-active="gameTime.currentFactor === targetFactor ? true : undefined" />
  </button>
</template>

<style scoped>
</style>
