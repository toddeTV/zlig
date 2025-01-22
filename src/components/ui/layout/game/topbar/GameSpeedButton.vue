<script setup lang="ts">
import useGameTime from '@/composables/useGameTimeStore.js'

const props = defineProps<{
  targetFactor: number
  class: string
}>()

const gameTime = useGameTime()
</script>

<template>
  <button @click="gameTime.currentFactor = targetFactor">
    <span :class="props.class" :data-active="gameTime.currentFactor === targetFactor ? true : undefined" />
  </button>
</template>

<style scoped>
</style>
