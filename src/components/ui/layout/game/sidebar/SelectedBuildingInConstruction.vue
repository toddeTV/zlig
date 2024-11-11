<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import type { BuildingAreaId, BuildingStateInConstruction, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingType: BuildingType
  buildingState: BuildingStateInConstruction
}>()

const gameState = useGameState()

function cancelBuild() {
  // TODO: Determine the refunds.

  gameState.$patch((state) => {
    state.buildings[props.buildingAreaId] = undefined
  })
}
</script>

<template>
  <h3 class="font-semibold mb-4">
    <span class="text-xl">{{ props.buildingType.name }}</span>
  </h3>
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

  <button class="border p-1 rounded" @click="cancelBuild">
    cancel build
  </button>
</template>
