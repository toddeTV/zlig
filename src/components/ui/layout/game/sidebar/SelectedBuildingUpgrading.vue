<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import type { BuildingAreaId, BuildingStateUpgrading, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingType: BuildingType
  buildingState: BuildingStateUpgrading
}>()

const gameState = useGameState()

function cancelUpgrade() {
  // TODO: Determine the refunds.

  gameState.$patch((state) => {
    state.buildings[props.buildingAreaId] = {
      internalBuffer: new ResourceRecord(),
      level: props.buildingState.level,
      state: 'producing',
      type: props.buildingType,
    }
  })
}
</script>

<template>
  <h3 class="font-semibold mb-4">
    <span class="text-xl">{{ props.buildingType.name }}</span>
    <span> (Level {{ props.buildingState.level }})</span>
  </h3>
  <p>
    This building is currently being upgraded to level <b>{{ props.buildingState.level + 1 }}</b>.
    Finished in: <b>{{ props.buildingState.durationRemaining.format() }}</b>
  </p>
  <div class="flex flex-col mt-2 mb-4">
    <ProgressBar
      :max="props.buildingState.initialDuration.milliseconds.toNumber()"
      min="0"
      :value="props.buildingState.durationRemaining.milliseconds.toNumber()"
    />
  </div>

  <button class="border p-1 rounded" @click="cancelUpgrade">
    cancel upgrading
  </button>
</template>
