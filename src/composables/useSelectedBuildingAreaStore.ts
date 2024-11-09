import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types.js'

export default defineStore('selectedBuildingAreaStore', () => {
  const id = ref<BuildingAreaId | null>(null)

  return {
    id,
  }
})
