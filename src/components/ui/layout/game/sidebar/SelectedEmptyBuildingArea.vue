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
  <div class="flex flex-col gap-2 w-full h-full max-h-full pt-1 pb-1">
    <h3 class="text-xl font-semibold pl-2">
      Empty building area
    </h3>

    <!-- <UCarousel
      v-slot="{ item }"
      arrows
      :items="availableBuildings"
      :ui="{
        root: 'relative w-full h-full overflow-hidden',
        viewport: 'overflow-hidden w-full h-full px-16',
        container: 'flex items-start w-full h-full gap-3',
        item: 'basis-auto shrink-0 h-full aspect-square p-0 m-0',
        controls: 'absolute top-1/2 inset-x-14',
        arrows: '',
        prev: 'absolute rounded-full',
        next: 'absolute rounded-full',
      }"
      wheel-gestures
    > -->
    <UCarousel
      v-slot="{ item }"
      :items="availableBuildings"
      :ui="{
        root: 'relative w-full h-full overflow-hidden',
        viewport: 'overflow-hidden w-full h-full px-8',
        container: 'flex items-start w-full h-full gap-3',
        item: 'basis-auto shrink-0 h-full aspect-square p-0 m-0',
        controls: 'absolute top-1/2 inset-x-14',
        arrows: '',
        prev: 'absolute rounded-full',
        next: 'absolute rounded-full',
      }"
      wheel-gestures
    >
      <BuildingRow
        :building-area-id="props.buildingAreaId"
        :building-type="item"
      />
    </UCarousel>
  </div>
</template>

<style scoped>
</style>
