import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Big from 'big.js'
import { ResourceRecord } from '@/game-logic/resources.js'

export default defineStore('gameState', () => {
  return {
    resources: availableResources(new ResourceRecord({
      gold: new Big('25'),
    })),
  }
})

function availableResources(initial: ResourceRecord) {
  const availableResourceRecord = ref(initial)

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
