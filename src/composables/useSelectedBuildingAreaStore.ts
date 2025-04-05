import { defineStore } from 'pinia'
import type { BuildingAreaId } from '@/game-logic/types.js'

export const useSelectedBuildingAreaStore = defineStore('selected-building-area', () => {
  const id = ref<BuildingAreaId | null>(null)

  return {
    id,
  }
})
