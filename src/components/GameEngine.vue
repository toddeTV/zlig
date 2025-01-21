<script setup lang="ts">
import BuildingArea from '@/components/buildings/BuildingArea.vue'
import CameraAndControls from '@/components/CameraAndControls.vue'
import DistanceFog from '@/components/DistanceFog.vue'
import Lights from '@/components/Lights.vue'
import Island from '@/components/models/Island.vue'
import Ocean from '@/components/models/Ocean.vue'
import Waterfall from '@/components/models/Waterfall.vue'
import VisualHelper from '@/components/VisualHelper.vue'
import useBuildingAreas from '@/composables/useBuildingAreas.js'
import useGameTime from '@/composables/useGameTime.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { getLeafObjects } from '@/utils/threeHelper'
import { useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { scene } = useTresContext()
const { onBeforeRender } = useLoop()
const gameTime = useGameTime()
const { areas } = storeToRefs(useBuildingAreas())
const { init } = useBuildingAreas()

onBeforeRender(({ delta }) => {
  gameTime.tick(delta)
})

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

    <Suspense>
      <Waterfall
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
