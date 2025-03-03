<script setup lang="ts">
import BuildingArea from '@/components/buildings/BuildingArea.vue'
import CameraAndControls from '@/components/CameraAndControls.vue'
import DistanceFog from '@/components/DistanceFog.vue'
import Lights from '@/components/Lights.vue'
import Island from '@/components/models/Island.vue'
import Ocean from '@/components/models/Ocean.vue'
import Waterfall from '@/components/models/Waterfall.vue'
import SkyDome from '@/components/SkyDome.vue'
import VisualHelper from '@/components/VisualHelper.vue'
import { useBuildingAreasStore } from '@/composables/useBuildingAreasStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { useSelectedBuildingAreaStore } from '@/composables/useSelectedBuildingAreaStore.js'
import { getLeafObjects } from '@/utils/threeHelper.js'
import { useLoop, useTresContext } from '@tresjs/core'
import { EffectComposerPmndrs, OutlinePmndrs } from '@tresjs/post-processing'
import { storeToRefs } from 'pinia'
import { BlendFunction } from 'postprocessing'
import { computed, ref, watchEffect } from 'vue'

const { scene } = useTresContext()
const { onBeforeRender } = useLoop()
const gameTime = useGameTimeStore()
const { areas } = storeToRefs(useBuildingAreasStore())
const { init } = useBuildingAreasStore()

const { id: selectedBuildAreaId } = storeToRefs(useSelectedBuildingAreaStore())

const cameraMoved = ref(false)

// // Disable auto clear color to allow for constant outline color independent of the clear color.
// // (When the clear color is a dark color, the outline color will be dark as well and therefore vanish.)
// // Alternative solution: Use sky dome instead of clear color as sky (Done in this project!)
// renderer.value.autoClearColor = false

init()

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

onBeforeRender(({ delta }) => {
  gameTime.tick(delta)
})
</script>

<template>
  <VisualHelper />
  <CameraAndControls
    @camera-moved="() => cameraMoved = true"
  />
  <SkyDome />
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
    <EffectComposerPmndrs>
      <OutlinePmndrs
        :blend-function="BlendFunction.SCREEN"
        :edge-glow="10"
        :edge-strength="2000"
        :outlined-objects="outlinedObjects"
        :pattern-scale="50"
      />
    </EffectComposerPmndrs>
  </Suspense>
</template>

<style scoped>
</style>
