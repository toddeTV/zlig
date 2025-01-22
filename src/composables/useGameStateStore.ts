import { ResourceRecord } from '@/game-logic/resources.js'
import Big from 'big.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BuildingAreaId, BuildingInstance } from '@/game-logic/types.js'

export const useGameStateStore = defineStore('game-state', () => {
  return {
    buildings: buildingsState(),
    resources: availableResources(),
  }
})

function buildingsState() {
  const buildings = ref<Record<BuildingAreaId, BuildingInstance | undefined >>({
    // TODO: Load from the saved state.
  })

  return buildings
}

function availableResources() {
  const availableResourceRecord = ref(new ResourceRecord({
    // TODO: Load from the saved state.
    gold: new Big('100'),
  }))

  return availableResourceRecord
}
