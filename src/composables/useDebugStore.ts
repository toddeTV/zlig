import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('debugStore', () => {
  const showLightHelper = ref(false)
  const showCameraHelper = ref(false)
  const showFog = ref(true)

  return {
    showCameraHelper,
    showFog,
    showLightHelper,
  }
})
