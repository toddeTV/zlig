import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

// One second in real time is one second in game time.
export const GAMETIME_SPEED_REALTIME = 1

// One second in real time are 15 minutes in game time.
export const GAMETIME_SPEED_REGULAR = 60 * 15

// One second in real time is one hour in game time.
export const GAMETIME_SPEED_FAST = 60 * 60

// One second in real time are three hours in game time.
export const GAMETIME_SPEED_FASTER = 60 * 60 * 3

export default defineStore('gameTime', () => {
  const startTime = new Date(0)
  // TODO: Find hour that starts the day.
  startTime.setHours(8)

  const currentMilliseconds = ref(startTime.getTime())
  const currentTime = computed(() => new Date(currentMilliseconds.value))

  const currentSpeed = ref(GAMETIME_SPEED_FASTER)

  function tick(deltaSeconds: number) {
    const gameTimeSecondsPassed = deltaSeconds * currentSpeed.value

    currentMilliseconds.value += gameTimeSecondsPassed * 1000
  }

  return {
    currentSpeed,
    currentTime: readonly(currentTime),
    tick,
  }
})
