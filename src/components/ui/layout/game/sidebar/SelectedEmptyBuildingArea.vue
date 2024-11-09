<script setup lang="ts">
import { buildingTypes } from '@/game-logic/buildings/index.js'
import type { BuildingAreaId, BuildingInstance } from '@/game-logic/types.js'
import BuildingRow from './BuildingRow.vue'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
}>()

// TODO: Do not restrict this.
const availableBuildings = [
  buildingTypes.testBuilding,
]
</script>

<template>
  <div class="p-3">
    <h3 class="text-xl font-semibold mb-4">
      Empty building area
    </h3>
    <p class="mb-4">
      This building area is still empty. Choose a building here:
    </p>

    <div class="flex flex-col gap-2">
      <BuildingRow
        v-for="type of availableBuildings"
        :key="type.name"
        :building-area-id="props.buildingAreaId"
        :building-type="type"
      />
    </div>
  </div>
</template>
