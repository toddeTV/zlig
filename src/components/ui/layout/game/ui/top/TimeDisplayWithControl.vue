<script setup lang="ts">
import dayNightCycleDiskImg from '@/assets/images/day-night-cycle-disk.png'
import {
  GAME_TIME_FACTOR_FAST,
  GAME_TIME_FACTOR_FASTER,
  GAME_TIME_FACTOR_REGULAR,
  useGameTimeStore,
} from '@/composables/useGameTimeStore.js'
import { computed } from 'vue'

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

const dayNightCycleDiskRotation = computed(() => {
  const currentTime = gameTime.currentTime
  const rotationOffset = -0.7
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const totalMinutes = hours * 60 + minutes + rotationOffset * 60
  const rotation = (totalMinutes / (24 * 60)) * 360
  return `rotate(${rotation}deg)`
})
</script>

<template>
  <div class="relative flex flex-col w-[200px] h-full">
    <!-- real in-game time digital clock with control buttons -->
    <div class="z-20 absolute top-0 w-full h-full place-self-center">
      <div class="flex flex-col items-center">
        <p class="px-1 flex drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
          <!-- <span class="icon-[ph--clock] mt-1 mr-1 text-xl" /> -->
          <span class="text-xl font-semibold">{{ displayTime }}</span>
        </p>

        <div class="flex gap-1 text-md drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
          <TimeSpeedControlButton
            class="
            icon-[ph--pause-circle-light]
            hover:icon-[ph--pause-circle]
            data-[active]:icon-[ph--pause-circle-bold]
          "
            :target-factor="0"
          />

          <TimeSpeedControlButton
            class="
            icon-[ph--play-circle-light]
            hover:icon-[ph--play-circle]
            data-[active]:icon-[ph--play-circle-bold]
          "
            :target-factor="GAME_TIME_FACTOR_REGULAR"
          />

          <TimeSpeedControlButton
            class="
            icon-[ph--number-circle-two-light]
            hover:icon-[ph--number-circle-two]
            data-[active]:icon-[ph--number-circle-two-bold]
          "
            :target-factor="GAME_TIME_FACTOR_FAST"
          />

          <TimeSpeedControlButton
            class="
            icon-[ph--number-circle-three-light]
            hover:icon-[ph--number-circle-three]
            data-[active]:icon-[ph--number-circle-three-bold]
          "
            :target-factor="GAME_TIME_FACTOR_FASTER"
          />
        </div>
        <div class="text-black font-bold -mt-2">
          |
        </div>
      </div>
    </div>

    <!-- day-night cycle analog clock disk -->
    <div class="relative w-full h-[60px]">
      <img
        alt="Day-night cycle disk"
        class="w-[200px] -mt-[140px]"
        :src="dayNightCycleDiskImg"
        :style="{
          transform: dayNightCycleDiskRotation,
        }"
      >
    </div>
  </div>
</template>

<style scoped>
</style>
