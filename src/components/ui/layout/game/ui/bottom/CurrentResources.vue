<script setup lang="ts">
import { useGameStateStore } from '@/composables/useGameStateStore.js'

const gameState = useGameStateStore()
</script>

<template>
  <div class="flex gap-2 items-baseline text-2xl grow justify-center">
    <span class="icon-[ph--hand-coins-thin] mt-1 mr-1 text-xl" />
    <span>{{ gameState.resources.gold }}</span>
    <!-- TODO display gold per second income -->
  </div>
</template>

<style scoped>
</style>
