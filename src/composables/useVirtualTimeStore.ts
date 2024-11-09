import { defineStore } from 'pinia'
import { Color, Vector3 } from 'three'
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
  const a = 50 // Semi-major axis along the X-axis
  const b = 25 // Semi-minor axis along the Y-axis

  // Function to map a value between a range
  function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }

  // current virtual time
  const currentVirtualTime = ref(new Date(1, 1, 1970, 0, 0, 0, 0))
  onMounted(() => { // TODO must be calculated with the animated frames better than an external interval
    // the interval for updating the virtual time
    setInterval(() => {
      currentVirtualTime.value = new Date(currentVirtualTime.value.getTime() + virtualTimeMultiplier * intervalSpeed)
    }, intervalSpeed)
  })

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

  // ambient intensity
  function calculateLightBySunPosition(
    sunPosition: Vector3,
  ) {
    const normalizedY = mapRange(sunPosition.y, -b, b, -1.0, 1.0) // Normalize the height between values

    let ambientIntensity = 0.8
    // normal sun intensity
    let sunIntensity = 1.0
    // sun is off when under the horizon
    if (normalizedY <= 0.01) {
      sunIntensity = 0.0
      ambientIntensity = 3.0
    }
    // if sun is close to horizon the intensity falls off to zero
    else if (normalizedY <= 0.2) {
      sunIntensity = mapRange(normalizedY, 0.01, 0.2, 0.0, 1.0)
      ambientIntensity = mapRange(normalizedY, 0.01, 0.2, 3.0, 0.8)
    }

    const colorSunDay = new Color(0xFFF9ED)
    const colorAmbientDay = new Color(0xE0F3FF)
    const colorSunDown = new Color(0xEB5B00)
    // const colorAmbientDown = new Color(0xFFDDB7)
    const colorAmbientDown = new Color(0xB6818F)
    const colorSkyDown = new Color(0x403538)
    const colorAmbientNight = new Color(0x8F91C4)
    const colorSkyNight = new Color(0x1E1F39)
    const ambientColor = colorAmbientDay
    const sunColor = colorSunDay
    const skyColor = colorAmbientDay
    if (normalizedY <= -0.25) {
      ambientColor.set(colorAmbientNight)
      skyColor.set(colorSkyNight)
    }
    else if (normalizedY <= 0.01) {
      const t = mapRange(normalizedY, -0.25, 0.01, 0.0, 1.0)
      ambientColor.lerpColors(colorAmbientNight, colorAmbientDown, t)
      skyColor.lerpColors(colorSkyNight, colorSkyDown, t)
    }
    else if (normalizedY <= 0.25) {
      const t = mapRange(normalizedY, 0.01, 0.25, 0.0, 1.0)
      sunColor.lerpColors(colorSunDown, colorSunDay, t)
      ambientColor.lerpColors(colorAmbientDown, colorAmbientDay, t)
      skyColor.lerpColors(colorSkyDown, colorAmbientDay, t)
    }

    return { ambientColor, ambientIntensity, skyColor, sunColor, sunIntensity }
  }

  return {
    calculateLightBySunPosition,
    calculateSunPosition,
    currentVirtualTime: readonly(currentVirtualTime),
  }
})
