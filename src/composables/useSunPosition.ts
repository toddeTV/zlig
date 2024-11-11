import useVirtualTimeStore from '@/composables/useVirtualTimeStore.js'
import mapRange from '@/utils/mapRange.js'
import { defineStore, storeToRefs } from 'pinia'
import { Vector3 } from 'three'
import { computed } from 'vue'

export default defineStore('sunPosition', () => {
  const a = 50 // Semi-major axis along the X-axis
  const b = 25 // Semi-minor axis along the Y-axis

  const virtualTime = useVirtualTimeStore()
  const { currentVirtualTime } = storeToRefs(virtualTime)

  // Calculate the angle (here you scale the time to a full cycle in a virtual "day")
  const theta = computed(() => {
    return (currentVirtualTime.value.getTime() / 1000 * 2 * Math.PI) / (24 * 3600)
  })

  // Calculate the light's position on the ellipse
  const x = computed(() => a * Math.cos(theta.value))
  const y = computed(() => b * Math.sin(theta.value))

  const sunPosition = computed(() => new Vector3(x.value, y.value, 100))

  // Normalize the height between values
  const normalizedSunY = computed(() => mapRange(y.value, -b, b, -1.0, 1.0))

  return {
    normalizedSunY,
    sunPosition,
  }
})
