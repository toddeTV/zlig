<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import { useLoop } from '@tresjs/core'
import type { BuildingAreaId, BuildingStateUpgrading, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateUpgrading
}>()

const gameState = useGameState()
const { onBeforeRender } = useLoop()

onBeforeRender((event) => {
  const { delta } = event

  const secondsRemaining = props.state.secondsRemaining.minus(delta)

  if (secondsRemaining.gt(0)) {
    gameState.buildings[props.areaId] = {
      level: props.state.level,
      secondsRemaining,
      state: 'upgrading',
      type: props.buildingType,
    }
  }
  else {
    gameState.buildings[props.areaId] = {
      internalBuffer: new ResourceRecord(),
      level: props.state.level + 1,
      state: 'producing',
      type: props.buildingType,
    }
  }
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
