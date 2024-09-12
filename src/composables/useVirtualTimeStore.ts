import { defineStore } from 'pinia'
import { Vector3 } from 'three'
import { onMounted, readonly, ref } from 'vue'

export default defineStore('virtualTimeStore', () => {
  // helper variables
  const virtualTimeMultiplier = 5000 // `1` means real time, `2` means 2x speed, `0.5` means half speed, etc.
  const intervalSpeed = 100 // in milliseconds, how often to update the virtual time
  const a = 50 // Semi-major axis along the X-axis
  const b = 25 // Semi-minor axis along the Y-axis

  // Function to map a value between a range
  function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }

  // current virtual time
  const currentVirtualTime = ref(new Date(1, 1, 1970, 0, 0, 0, 0))
  function calculateNewVirtualTime(oldTime: Date) {
    return new Date(oldTime.getTime() + virtualTimeMultiplier * intervalSpeed)
  }

  // sun position
  function calculateSunPosition(time: Date) {
    // Calculate the angle (here you scale the time to a full cycle in a virtual "day")
    const theta = (time.getTime() / 1000 * 2 * Math.PI) / (24 * 3600)

    // Calculate the light's position on the ellipse
    const x = a * Math.cos(theta)
    const y = b * Math.sin(theta)

    // set sun position
    return new Vector3(x, y, 100)
  }

  // sun intensity
  function calculateSunIntensity(
    sunPosition: Vector3,
    rangeMin: number,
    rangeMax: number,
  ) {
  // Adjust the light intensity based on the height of the "sun" (y value) ...
    const normalizedY = mapRange(sunPosition.y, -b, b, rangeMin, rangeMax) // Normalize the height between values
    return mapRange(normalizedY, 0, 1, 0.2, 1) // Lower intensity at sunrise/sunset, max at noon
  }

  // TODO must be calculated with the animated frames better than an external interval
  // the interval for updating the virtual time
  onMounted(() => {
    setInterval(() => {
      const oldTime = currentVirtualTime.value
      currentVirtualTime.value = calculateNewVirtualTime(oldTime)
    }, intervalSpeed)
  })

  return {
    calculateSunIntensity,
    calculateSunPosition,
    currentVirtualTime: readonly(currentVirtualTime),
  }
})
