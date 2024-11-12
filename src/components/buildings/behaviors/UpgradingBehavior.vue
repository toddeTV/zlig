<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useGameTime from '@/composables/useGameTime.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import { Duration } from '@/utils/duration.js'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import type { BuildingAreaId, BuildingStateUpgrading, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  areaId: BuildingAreaId
  buildingType: BuildingType
  state: BuildingStateUpgrading
}>()

const { buildings } = storeToRefs(useGameState())
const { currentTime } = storeToRefs(useGameTime())

watch(currentTime, (time, prev) => {
  const durationRemaining = props.state.durationRemaining.minus(Duration.fromDates(prev, time))

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
