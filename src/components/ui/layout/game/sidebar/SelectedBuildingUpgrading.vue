<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import { storeToRefs } from 'pinia'
import type { BuildingAreaId, BuildingStateUpgrading, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingType: BuildingType
  buildingState: BuildingStateUpgrading
}>()

const { buildings } = storeToRefs(useGameStateStore())

function cancelUpgrade() {
  // TODO: Determine the refunds.

  buildings.value[props.buildingAreaId] = {
    internalBuffer: new ResourceRecord(),
    level: props.buildingState.level,
    state: 'producing',
    type: props.buildingType,
  }
}
</script>

<template>
  <h3 class="font-semibold mb-2">
    <span class="text-xl">{{ props.buildingType.name }}</span>
    <span> (Level {{ props.buildingState.level }})</span>
  </h3>

  <p class="ml-4 mb-6">
    {{ props.buildingType.description }}
  </p>

  <p>
    This building is currently being upgraded to level <b>{{ props.buildingState.level + 1 }}</b>.
    Finished in: <b>{{ props.buildingState.durationRemaining.format() }}</b>
  </p>
  <div class="flex flex-col mt-2 mb-4">
    <ProgressBar
      :max="props.buildingState.initialDuration.milliseconds.toNumber()"
      :min="0"
      :value="props.buildingState.durationRemaining.milliseconds.toNumber()"
    />
  </div>

  <button class="border border-gray-200 p-1 rounded-sm" @click="cancelUpgrade">
    cancel upgrading
  </button>
</template>

<style scoped>
</style>
