<script setup lang="ts">
import useBuildingAreas from '@/composables/useBuildingAreas.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import BuildingArea from './buildings/BuildingArea.vue'
import CameraAndControls from './CameraAndControls.vue'
import DistanceFog from './DistanceFog.vue'
import Lights from './Lights.vue'
import Island from './models/Island.vue'
import Ocean from './models/Ocean.vue'
import VisualHelper from './VisualHelper.vue'

const { areas } = storeToRefs(useBuildingAreas())
const { init } = useBuildingAreas()
init()

const { id: selectedBuildAreaId } = storeToRefs(useSelectedBuildingArea())

const outlinedObjects = computed(() => {
  if (!selectedBuildAreaId.value) {
    return []
  }
  // const selectedBuildingArea = scene.value.getObjectByName(selectedBuildAreaId.value)
  const selectedBuildingArea = scene.value.getObjectByName(`building-area-${selectedBuildAreaId.value}`)
  if (!selectedBuildingArea) {
    return []
  }
  return getLeafObjects(selectedBuildingArea)
})

const cameraMoved = ref(false)
</script>

<template>
  <VisualHelper />
  <CameraAndControls
    @camera-moved="() => cameraMoved = true"
  />
  <Lights />
  <DistanceFog />

  <TresGroup
    name="sceneGroup"
    @click="() => {
      if (!cameraMoved) {
        selectedBuildAreaId = null
      }
    }"
    @pointer-down="() => cameraMoved = false"
  >
    <Suspense>
      <Island />
    </Suspense>

    <Suspense>
      <BuildingArea
        v-for="area in areas"
        :id="area.id"
        :key="area.id"
        :position="area.position"
        :rotation="area.rotation"
      />
    </Suspense>

    <Suspense>
      <Ocean
        :position="[0, 0, 0]"
      />
    </Suspense>
  </TresGroup>

  <Suspense>
    <EffectComposer>
      <Outline
        :edge-strength="50"
        :outlined-objects="outlinedObjects"
        :pattern-scale="50"
      />
    </EffectComposer>
  </Suspense>
</template>

<style scoped>
</style>
