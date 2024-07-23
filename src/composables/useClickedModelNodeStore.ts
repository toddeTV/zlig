import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('clickedModelNodeStore', () => {
  const activeIds = ref<number[]>([])

  return {
    activeIds,
  }
})
