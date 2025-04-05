import { useSunPositionStore } from '@/composables/useSunPositionStore.js'
import { defineStore, storeToRefs } from 'pinia'
import { Color } from 'three'
import { lerp, smootherstep, smoothstep } from 'three/src/math/MathUtils.js'

export const useCalculatedLightsStore = defineStore('calculated-lights', () => {
  const intensityFraction = calculateSunFractionAtHorizonForIntensities()
  const ambientIntensity = computed(() => lerp(3, 0.8, intensityFraction.value))
  const sunIntensity = computed(() => lerp(0, 1, intensityFraction.value))

  const lightColors = calculateLightColors()

  return {
    ambientIntensity,
    lightColors,
    sunIntensity,
  }
})

function calculateSunFractionAtHorizonForIntensities() {
  const AT_HORIZON_Y = 0.01
  const NEAR_HORIZON_Y = 0.2

  const { normalizedSunY } = storeToRefs(useSunPositionStore())

  // The smootherstep function returns a fraction that the sun y is between the two constants.
  // It also clamps them which is all we want, yay.
  return computed(() => smootherstep(normalizedSunY.value, AT_HORIZON_Y, NEAR_HORIZON_Y))
}

function calculateLightColors() {
  const BELOW_HORIZON_Y = -0.25
  const AT_HORIZON_Y = 0.01
  const NEAR_HORIZON_Y = 0.25

  const { normalizedSunY } = storeToRefs(useSunPositionStore())

  return computed(() => {
    const colorSunDay = new Color(0xFFF9ED)
    const colorAmbientDay = new Color(0xE0F3FF)
    const colorSunDown = new Color(0xEB5B00)
    // const colorAmbientDown = new Color(0xFFDDB7)
    const colorAmbientDown = new Color(0xB6818F)
    const colorSkyDown = new Color(0x403538)
    const colorAmbientNight = new Color(0x8F91C4)
    const colorSkyNight = new Color(0x1E1F39)

    const ambient = colorAmbientDay
    const sky = colorAmbientDay
    const sun = colorSunDay

    if (normalizedSunY.value <= BELOW_HORIZON_Y) {
      ambient.set(colorAmbientNight)
      sky.set(colorSkyNight)
    }
    else if (normalizedSunY.value <= AT_HORIZON_Y) {
      const t = smoothstep(normalizedSunY.value, BELOW_HORIZON_Y, AT_HORIZON_Y)

      ambient.lerpColors(colorAmbientNight, colorAmbientDown, t)
      sky.lerpColors(colorSkyNight, colorSkyDown, t)
    }
    else if (normalizedSunY.value <= NEAR_HORIZON_Y) {
      const t = smoothstep(normalizedSunY.value, AT_HORIZON_Y, NEAR_HORIZON_Y)

      ambient.lerpColors(colorAmbientDown, colorAmbientDay, t)
      sky.lerpColors(colorSkyDown, colorAmbientDay, t)
      sun.lerpColors(colorSunDown, colorSunDay, t)
    }

    return { ambient, sky, sun }
  })
}
