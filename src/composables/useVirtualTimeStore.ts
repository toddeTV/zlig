import { defineStore } from 'pinia'
import { onMounted, readonly, ref } from 'vue'
import type { RGB } from 'three'

export interface TimeColorTransition {
  startHour: number
  endHour: number
  startColor: RGB
  endColor: RGB
}

export default defineStore('virtualTimeStore', () => {
  // helper variables
  const virtualTimeMultiplier = 2000 // `1` means real time, `2` means 2x speed, `0.5` means half speed, etc.
  const intervalSpeed = 100 // in milliseconds, how often to update the virtual time

  // current virtual time
  const currentVirtualTime = ref(new Date(1, 1, 1970, 0, 0, 0, 0))
  onMounted(() => { // TODO must be calculated with the animated frames better than an external interval
    // the interval for updating the virtual time
    setInterval(() => {
      currentVirtualTime.value = new Date(currentVirtualTime.value.getTime() + virtualTimeMultiplier * intervalSpeed)
    }, intervalSpeed)
  })

  return {
    currentVirtualTime: readonly(currentVirtualTime),
  }
})
