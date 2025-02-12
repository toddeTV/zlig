<script setup lang="ts">
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'

const props = defineProps<{
  targetTime: number
  class: string
}>()

const gameTime = useGameTimeStore()
</script>

<template>
  <button @click="gameTime.currentMilliseconds = targetTime">
    <span :class="props.class" />
  </button>
</template>

<style scoped>
</style>
