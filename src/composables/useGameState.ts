import { ResourceRecord } from '@/game-logic/resources.js'
import Big from 'big.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { BuildingInstance, BuildingLotId } from '@/game-logic/buildings/types.js'

export default defineStore('gameState', () => {
  return {
    buildings: buildingsState(),
    resources: availableResources(),
  }
})

function buildingsState() {
  const buildings = ref<Record<BuildingLotId, BuildingInstance | undefined >>({
    // TODO: Load from the saved state.
  })

  return buildings
}

function availableResources() {
  const availableResourceRecord = ref(new ResourceRecord({
    // TODO: Load from the saved state.
    gold: new Big('100'),
  }))

  const available = computed(() => availableResourceRecord.value.round().asPlain())

  function add(other: ResourceRecord) {
    availableResourceRecord.value = availableResourceRecord.value.plus(other)
  }

  function remove(other: ResourceRecord) {
    availableResourceRecord.value = availableResourceRecord.value.minus(other)
  }

  function hasAvailable(required: ResourceRecord) {
    return availableResourceRecord.value.gte(required)
  }

  return {
    add,
    available,
    hasAvailable,
    remove,
  }
}
