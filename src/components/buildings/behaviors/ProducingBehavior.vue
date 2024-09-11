<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import useGameState from '@/composables/useGameState.js'
import type { BuildingLotId, BuildingStateProducing, BuildingType } from '@/game-logic/buildings/types.js'

const props = defineProps<{
  lotId: BuildingLotId
  buildingType: BuildingType
  state: BuildingStateProducing
}>()

const gameState = useGameState()
const { onBeforeRender } = useLoop()

function getIncome() {
  // TODO: Factor in modifiers.
  const income = props.buildingType.levelProgression.getBaseIncomeForLevel(props.state.level)

  return income
}

onBeforeRender((event) => {
  const { delta } = event

  const income = getIncome().times(delta)

  // The internal buffer is this full now.
  let buffer = props.state.internalBuffer.plus(income)
  // Pass resources to the "warehouse" if there is more than 1 available. Instead of comparing each individual resource
  // round them down and pass the result to the warehouse. The rounded resources might be all zeroes but this is not a
  // problem.
  const produced = buffer.round()
  buffer = buffer.minus(produced)

  gameState.resources.add(produced)
  gameState.buildings[props.lotId] = {
    internalBuffer: buffer,
    level: props.state.level,
    state: 'producing',
    type: props.buildingType,
  }
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template></template>
