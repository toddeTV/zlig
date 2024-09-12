import { defineStore } from 'pinia'
import { Vector3 } from 'three'
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

  // TODO does not work at all ... do not use hours but full time, problems when time span is over midnight & sunrise should not start at midnight
  // get a color based on the time with transition rules
  function getColorByTime(
    date: Date,
    transitions: TimeColorTransition[],
  ): RGB {
    const hours = date.getHours()

    // Loop through all defined transitions
    for (const transition of transitions) {
      // If the current hour is within the transition range
      if (hours >= transition.startHour && hours < transition.endHour) {
        const totalHours = transition.endHour - transition.startHour
        const progress = (hours - transition.startHour) / totalHours
        return getColorForPercentage(progress, transition.startColor, transition.endColor)
      }
    }

    // If no transitions match, return the color of the last defined period
    const lastTransition = transitions[transitions.length - 1]
    return getColorForPercentage(1, lastTransition.startColor, lastTransition.endColor)
  }

  // Function to get the interpolated color based on the percentage progress
  function getColorForPercentage(pct: number, startColor: RGB, endColor: RGB): RGB {
    const lower = { color: startColor, pct: 0 }
    const upper = { color: endColor, pct: 1 }

    const range = upper.pct - lower.pct
    const rangePct = pct / range
    const pctLower = 1 - rangePct
    const pctUpper = rangePct

    const color = {
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    }

    const rgb = { b: color.b, g: color.g, r: color.r }

    return rgb
  }

  function rgbToHex(rgb: RGB): string {
    return (
      `#${
        ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
          .toString(16)
          .slice(1)
          .toUpperCase()}`
    )
  }

  // time color transition preset for the sky
  const skyTimeColorTransitionPreset: TimeColorTransition[] = [
    // TODO develop a better color scheme
    { endColor: { b: 255, g: 215, r: 135 }, endHour: 4, startColor: { b: 0, g: 0, r: 0 }, startHour: 22 }, // Sunrise
    { endColor: { b: 0, g: 0, r: 0 }, endHour: 22, startColor: { b: 0, g: 0, r: 0 }, startHour: 15 }, // Night
    { endColor: { b: 255, g: 215, r: 135 }, endHour: 13, startColor: { b: 255, g: 215, r: 135 }, startHour: 4 }, // Day
    { endColor: { b: 0, g: 0, r: 0 }, endHour: 15, startColor: { b: 255, g: 215, r: 135 }, startHour: 13 }, // Sunset
  ]

  return {
    calculateSunIntensity,
    calculateSunPosition,
    currentVirtualTime: readonly(currentVirtualTime),
    getColorByTime,
    rgbToHex,
    skyTimeColorTransitionPreset,
  }
})
