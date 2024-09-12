import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('debugStore', () => {
  const isDebugLights = ref(false)
  const isDebugFog = ref(true)

  return {
    isDebugFog,
    isDebugLights,
  }
})
