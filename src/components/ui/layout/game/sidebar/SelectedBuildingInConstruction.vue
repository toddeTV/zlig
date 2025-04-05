<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { storeToRefs } from 'pinia'
import type { BuildingAreaId, BuildingStateInConstruction, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingType: BuildingType
  buildingState: BuildingStateInConstruction
}>()

const { buildings } = storeToRefs(useGameStateStore())

function cancelBuild() {
  // TODO: Determine the refunds.

  buildings.value[props.buildingAreaId] = undefined
}
</script>

<template>
  <h3 class="font-semibold mb-2">
    <span class="text-xl">{{ props.buildingType.name }}</span>
  </h3>

  <p class="ml-4 mb-6">
    {{ props.buildingType.description }}
  </p>

  <p>
    This building is currently under construction.
    Finished in: <b>{{ props.buildingState.durationRemaining.format() }}</b>
  </p>
  <div class="flex flex-col mt-2 mb-4">
    <ProgressBar
      :max="props.buildingState.initialDuration.milliseconds.toNumber()"
      :min="0"
      :value="props.buildingState.durationRemaining.milliseconds.toNumber()"
    />
  </div>

  <button class="border p-1 rounded-sm" @click="cancelBuild">
    cancel build
  </button>
</template>

<style scoped>
</style>
