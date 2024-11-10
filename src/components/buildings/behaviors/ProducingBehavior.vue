<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useGameTime from '@/composables/useGameTime.js'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import type { BuildingAreaId, BuildingStateProducing, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateProducing
}>()

function getIncome() {
  // TODO: Factor in modifiers.
  const income = props.buildingType.levelProgression.getBaseIncomeForLevel(props.state.level)

  return income
}

const gameState = useGameState()
const { currentTime } = storeToRefs(useGameTime())

watch(currentTime, (time, prev) => {
  const deltaMs = time.getTime() - prev.getTime()

  const income = getIncome().times(deltaMs)

  // The internal buffer is this full now.
  let buffer = props.state.internalBuffer.plus(income)
  // Pass resources to the "warehouse" if there is more than 1 available. Instead of comparing each individual resource
  // round them down and pass the result to the warehouse. The rounded resources might be all zeroes but this is not a
  // problem.
  const produced = buffer.round()
  buffer = buffer.minus(produced)

  gameState.resources.add(produced)
  gameState.buildings[props.areaId] = {
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
