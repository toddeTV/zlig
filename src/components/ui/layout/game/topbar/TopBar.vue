<script setup lang="ts">
import GameSpeedButton from '@/components/ui/layout/game/topbar/GameSpeedButton.vue'
import Resources from '@/components/ui/Resources.vue'
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { GAME_TIME_FACTOR_FAST, GAME_TIME_FACTOR_FASTER, GAME_TIME_FACTOR_REGULAR, useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { computed } from 'vue'

const gameState = useGameStateStore()
const gameTime = useGameTimeStore()

// a computed property that rounds the current in-game time to the nearest 10-minute interval and returns
// it as a localized, short-formatted time string (no minutes < 10 and no seconds).
const displayTime = computed(() => {
  const time = new Date(gameTime.currentTime.getTime())
  const minutes = time.getMinutes()
  const roundedMinutes = Math.round(minutes / 10) * 10
  time.setMinutes(roundedMinutes)
  time.setSeconds(0)
  time.setMilliseconds(0)
  return time.toLocaleTimeString(undefined, { timeStyle: 'short' })
})
</script>

<template>
  <div class="bg-gray-300 shadow-sm z-20 flex items-center gap-3 p-3">
    <div class="flex gap-3 items-baseline text-2xl grow justify-center">
      <Resources :resources="gameState.resources" />
    </div>

    <div class="flex flex-col gap-1 items-center">
      <p class="border border-gray-200 rounded-lg px-1 bg-white flex">
        <span class="icon-[ph--clock] mt-1 mr-1 text-xl" />
        <span class="text-lg">{{ displayTime }}</span>
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
