import { defineStore } from 'pinia'

export const useDebugStore = defineStore('debug', () => {
  const showVisualHelper = ref(false)
  const showLightHelper = ref(false)
  const showCameraHelper = ref(false)
  const showFog = ref(true)
  const showWaterWireframe = ref(false)

  return {
    showCameraHelper,
    showFog,
    showLightHelper,
    showVisualHelper,
    showWaterWireframe,
  }
})
