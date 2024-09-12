import { defineStore } from 'pinia'
import { onMounted, readonly, ref } from 'vue'

export default defineStore('virtualTimeStore', () => {
  // the storing of the virtual time
  const currentVirtualTime = ref(new Date(1, 1, 1970, 8, 0, 0, 0)) // the store

  // the interval for updating the virtual time
  const virtualTimeMultiplier = 1000 // `1` means real time, `2` means 2x speed, `0.5` means half speed, etc.
  const intervalSpeed = 500 // in milliseconds, how often to update the virtual time
  onMounted(() => {
    setInterval(() => {
      currentVirtualTime.value = new Date(currentVirtualTime.value.getTime() + virtualTimeMultiplier * intervalSpeed)
    }, intervalSpeed)
  })

  return {
    currentVirtualTime: readonly(currentVirtualTime),
  }
})
