import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDebugStore = defineStore('debug', () => {
  const showVisualHelper = ref(false)
  const showLightHelper = ref(false)
  const showCameraHelper = ref(false)
  const showFog = ref(false)
  const showWaterWireframe = ref(false)

  return {
    showCameraHelper,
    showFog,
    showLightHelper,
    showVisualHelper,
    showWaterWireframe,
  }
})
