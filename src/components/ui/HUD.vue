<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import Resources from './Resources.vue'

const gameState = useGameState()
</script>

<template>
  <div class="absolute top-0 left-0 z-20 flex gap-4 items-center bg-white/80 border-b p-5 w-full">
    <p class="font-bold text-lg">
      Resources:
    </p>
    <Resources :resources="gameState.resources.available" />
  </div>
</template>
