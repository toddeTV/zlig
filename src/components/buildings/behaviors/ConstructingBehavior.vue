<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import { useLoop } from '@tresjs/core'
import type { BuildingAreaId, BuildingStateInConstruction, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateInConstruction
}>()

const gameState = useGameState()
const { onBeforeRender } = useLoop()

onBeforeRender((event) => {
  const { delta } = event

  const secondsRemaining = props.state.secondsRemaining.minus(delta)

  gameState.$patch((state) => {
    if (secondsRemaining.gt(0)) {
      state.buildings[props.areaId] = {
        initialSeconds: props.state.initialSeconds,
        level: 0,
        secondsRemaining,
        state: 'in-construction',
        type: props.buildingType,
      }
    }
    else {
      state.buildings[props.areaId] = {
        internalBuffer: new ResourceRecord(),
        level: 1,
        state: 'producing',
        type: props.buildingType,
      }
    }
  })
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
