import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('clickedModelNodeStore', () => {
  const activeUuid = ref<string | undefined>(undefined)

  return {
    activeUuid,
  }
})
