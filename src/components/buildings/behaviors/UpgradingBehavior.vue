<script setup lang="ts">
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import { storeToRefs } from 'pinia'
import type { BuildingAreaId, BuildingStateUpgrading, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateUpgrading
}>()

const { onTick } = useGameTimeStore()
const { buildings } = storeToRefs(useGameStateStore())

onTick(({ deltaGameSeconds }) => {
  const durationRemaining = props.state.durationRemaining.minus(Duration.fromSeconds(deltaGameSeconds))

  if (durationRemaining.milliseconds.gt(0)) {
    buildings.value[props.areaId] = {
      durationRemaining,
      initialDuration: props.state.initialDuration,
      level: props.state.level,
      state: 'upgrading',
      type: props.buildingType,
    }
    return
  }
  buildings.value[props.areaId] = {
    internalBuffer: new ResourceRecord(),
    level: props.state.level + 1,
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
