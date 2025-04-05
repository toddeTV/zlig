import { defineStore } from 'pinia'
import { mapLinear } from 'three/src/math/MathUtils.js'

// One second in real time are 15 minutes in game time.
export const GAME_TIME_FACTOR_REGULAR = 60 * 15

// One second in real time is one hour in game time.
export const GAME_TIME_FACTOR_FAST = 60 * 60

// One second in real time are three hours in game time.
export const GAME_TIME_FACTOR_FASTER = 60 * 60 * 3

export const useGameTimeStore = defineStore('game-time', () => {
  const startTime = new Date(0)
  // TODO: Find hour that starts the day.
  startTime.setHours(8)

  const currentMilliseconds = ref(startTime.getTime())
  const currentTime = computed(() => new Date(currentMilliseconds.value))

  const currentFactor = ref(GAME_TIME_FACTOR_REGULAR)

  const listeners = new Set<OnTickFn>()

  function tick(deltaSeconds: number) {
    if (currentFactor.value > 0) { // no updates when paused
      const gameTimeSecondsPassed = deltaSeconds * currentFactor.value

      currentMilliseconds.value += gameTimeSecondsPassed * 1000

      const divisor = mapLinear(gameTimeSecondsPassed, 0, 100, 1000, 4000)
      const ambientAnimationDelta = gameTimeSecondsPassed / divisor

      const args: OnTickFnArgs = {
        ambientAnimationDelta,
        deltaGameSeconds: gameTimeSecondsPassed,
        gameTime: currentTime.value,
      }

      listeners.forEach(cb => cb(args))
    }
  }

  function onTick(callback: OnTickFn) {
    listeners.add(callback)

    onUnmounted(() => {
      listeners.delete(callback)
    })
  }

  return {
    currentFactor,
    currentTime: readonly(currentTime),
    onTick,
    tick,
  }
})

interface OnTickFnArgs {
  deltaGameSeconds: number
  gameTime: Date
  ambientAnimationDelta: number
}

type OnTickFn = (args: OnTickFnArgs) => void
