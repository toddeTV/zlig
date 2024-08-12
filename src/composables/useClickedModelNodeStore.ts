import { defineStore } from 'pinia'
import { reactive } from 'vue'

export default defineStore('clickedModelNodeStore', () => {
  const activeIds = reactive(new Set<number>())

  return {
    activeIds,
  }
})
