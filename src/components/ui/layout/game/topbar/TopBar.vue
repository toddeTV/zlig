<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useGameTime, { GAME_TIME_FACTOR_FAST, GAME_TIME_FACTOR_FASTER, GAME_TIME_FACTOR_REGULAR } from '@/composables/useGameTime.js'
import Resources from '../../../Resources.vue'
import GameSpeedButton from './GameSpeedButton.vue'

const gameState = useGameState()
const gameTime = useGameTime()
</script>

<template>
  <div class="bg-gray-300 shadow z-20 flex items-center gap-3 p-3">
    <div class="flex gap-3 items-baseline text-2xl flex-grow justify-center">
      <Resources :resources="gameState.resources" />
    </div>

    <div class="flex flex-col gap-1 items-center">
      <p class="text-lg border rounded-lg px-1 bg-white">
        {{ gameTime.currentTime.toLocaleTimeString(undefined, { timeStyle: 'short' }) }}
      </p>

      <div class="flex gap-1 text-xl">
        <GameSpeedButton
          class="
            icon-[ph--pause-circle-light]
            hover:icon-[ph--pause-circle]
            data-[active]:icon-[ph--pause-circle-bold]
          "
          :target-factor="0"
        />

        <GameSpeedButton
          class="
            icon-[ph--play-circle-light]
            hover:icon-[ph--play-circle]
            data-[active]:icon-[ph--play-circle-bold]
          "
          :target-factor="GAME_TIME_FACTOR_REGULAR"
        />

        <GameSpeedButton
          class="
            icon-[ph--number-circle-two-light]
            hover:icon-[ph--number-circle-two]
            data-[active]:icon-[ph--number-circle-two-bold]
          "
          :target-factor="GAME_TIME_FACTOR_FAST"
        />

        <GameSpeedButton
          class="
            icon-[ph--number-circle-three-light]
            hover:icon-[ph--number-circle-three]
            data-[active]:icon-[ph--number-circle-three-bold]
          "
          :target-factor="GAME_TIME_FACTOR_FASTER"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
