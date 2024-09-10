<script setup lang="ts">
import BuildingLot from './buildings/BuildingLot.vue'
import CameraAndControls from './CameraAndControls.vue'
import DistanceFog from './DistanceFog.vue'
import Lights from './Lights.vue'
import Island from './models/Island.vue'
import VisualHelper from './VisualHelper.vue'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent'
import useSelectedBuildingLot from '@/composables/useSelectedBuildingLot.js'
import useBuildingLots from '@/composables/useBuildingLots.js'

const buildingLots = useBuildingLots()
buildingLots.init()

const selectedBuildingLot = useSelectedBuildingLot()

function onNodeClick(event: TresJsClickEvent) {
  event.stopPropagation()

  selectedBuildingLot.id = null
}
</script>

<template>
  <VisualHelper />
  <CameraAndControls />
  <Lights />
  <DistanceFog />

  <TresGroup @click="onNodeClick">
    <Suspense>
      <Island
        :position="[0, 0, 0]"
      />
    </Suspense>

    <Suspense>
      <BuildingLot
        v-for="lot in buildingLots.lots"
        :id="lot.id"
        :key="lot.id"
        :position="lot.position"
      />
    </Suspense>
  </TresGroup>
</template>

<style scoped>
</style>
