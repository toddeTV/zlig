<script setup lang="ts">
import BuildingRow from '@/components/ui/layout/game/sidebar/BuildingRow.vue'
import { buildingTypes } from '@/game-logic/buildings/index.js'
import type { BuildingAreaId } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
}>()

// TODO: Create categories for the buildings.
const availableBuildings = Object.values(buildingTypes)
</script>

<template>
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
</template>

<style scoped>
</style>
