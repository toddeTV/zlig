<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useGameTime from '@/composables/useGameTime.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import type { BuildingAreaId, BuildingStateInConstruction, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateInConstruction
}>()

const gameState = useGameState()
const { currentTime } = storeToRefs(useGameTime())

watch(currentTime, (time, prev) => {
  const deltaMs = time.getTime() - prev.getTime()

  const millisecondsRemaining = props.state.millisecondsRemaining.minus(deltaMs)

  if (millisecondsRemaining.gt(0)) {
    gameState.buildings[props.areaId] = {
      level: 0,
      millisecondsRemaining,
      state: 'in-construction',
      type: props.buildingType,
    }
  }
  else {
    gameState.buildings[props.areaId] = {
      internalBuffer: new ResourceRecord(),
      level: 1,
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
