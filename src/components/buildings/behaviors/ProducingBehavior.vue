<script setup lang="ts">
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import Big from 'big.js'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import type { BuildingAreaId, BuildingStateProducing, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateProducing
}>()

const { buildings, resources } = storeToRefs(useGameStateStore())

// TODO: Put this into the game state.
// TODO: Make this individual per building type.
const incomeModifier = new ResourceRecord({ gold: new Big('1') })

const currentIncome = computed(() => {
  const base = props.buildingType.levelProgression.getBaseIncomeForLevel(props.state.level)

  return base.times(incomeModifier)
})

const { currentTime } = storeToRefs(useGameTimeStore())

watch(currentTime, (time, prev) => {
  const deltaMs = time.getTime() - prev.getTime()

  const incomeThisTick = currentIncome.value.times(deltaMs)

  // The internal buffer is this full now.
  let buffer = props.state.internalBuffer.plus(incomeThisTick)

  // Pass resources to the "warehouse" if there is more than 1 available. Instead of comparing each individual resource
  // round them down and pass the result to the warehouse. The rounded resources might be all zeroes but this is not a
  // problem.
  const produced = buffer.roundDown()
  buffer = buffer.minus(produced)

  resources.value = resources.value.plus(produced)

  buildings.value[props.areaId] = {
    internalBuffer: buffer,
    level: props.state.level,
    state: 'producing',
    type: props.buildingType,
  }
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
