<script setup lang="ts">
import useBuildingLots from '@/composables/useBuildingLots.js'
import useSelectedBuildingLot from '@/composables/useSelectedBuildingLot.js'
import { ref } from 'vue'
import BuildingLot from './buildings/BuildingLot.vue'
import CameraAndControls from './CameraAndControls.vue'
import DistanceFog from './DistanceFog.vue'
import Lights from './Lights.vue'
import Island from './models/Island.vue'
import VisualHelper from './VisualHelper.vue'

const buildingLots = useBuildingLots()
buildingLots.init()

const selectedBuildingLot = useSelectedBuildingLot()

const cameraMoved = ref(false)
</script>

<template>
  <VisualHelper />
  <CameraAndControls @camera-moved="() => cameraMoved = true" />
  <Lights />
  <DistanceFog />

  <TresGroup
    @click="() => {
      if (!cameraMoved) {
        selectedBuildingLot.id = null
      }
    }"
    @pointer-down="() => cameraMoved = false"
  >
    <Suspense>
      <Island />
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
