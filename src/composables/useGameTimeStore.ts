import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

// One second in real time are 15 minutes in game time.
export const GAME_TIME_FACTOR_REGULAR = 60 * 15

// One second in real time is one hour in game time.
export const GAME_TIME_FACTOR_FAST = 60 * 60

// One second in real time are three hours in game time.
export const GAME_TIME_FACTOR_FASTER = 60 * 60 * 3

export default defineStore('game-time', () => {
  const startTime = new Date(0)
  // TODO: Find hour that starts the day.
  startTime.setHours(8)

  const currentMilliseconds = ref(startTime.getTime())
  const currentTime = computed(() => new Date(currentMilliseconds.value))

  const currentFactor = ref(GAME_TIME_FACTOR_REGULAR)

  function tick(deltaSeconds: number) {
    const gameTimeSecondsPassed = deltaSeconds * currentFactor.value

    currentMilliseconds.value += gameTimeSecondsPassed * 1000
  }

  return {
    currentFactor,
    currentTime: readonly(currentTime),
    tick,
  }
})
