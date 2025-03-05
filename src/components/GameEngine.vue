<script setup lang="ts">
import BuildingArea from '@/components/buildings/BuildingArea.vue'
import CameraAndControls from '@/components/CameraAndControls.vue'
import DistanceFog from '@/components/DistanceFog.vue'
import Lights from '@/components/Lights.vue'
import Island from '@/components/models/Island.vue'
import Ocean from '@/components/models/Ocean.vue'
import Waterfall from '@/components/models/Waterfall.vue'
import SeaBed from '@/components/SeaBed.vue'
import SkyDome from '@/components/SkyDome.vue'
import VisualHelper from '@/components/VisualHelper.vue'
import { useBuildingAreasStore } from '@/composables/useBuildingAreasStore.js'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { useSelectedBuildingAreaStore } from '@/composables/useSelectedBuildingAreaStore.js'
import { getLeafObjects } from '@/utils/threeHelper.js'
import { useLoop, useTresContext } from '@tresjs/core'
import { EffectComposerPmndrs, OutlinePmndrs } from '@tresjs/post-processing'
import { useTimeoutFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { BlendFunction } from 'postprocessing'
import { Material, Mesh } from 'three'
import { computed, ref, watch } from 'vue'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'
import type { Object3D } from 'three'

const { scene } = useTresContext()
const { onBeforeRender } = useLoop()
const gameTime = useGameTimeStore()
const { areas } = storeToRefs(useBuildingAreasStore())
const { init } = useBuildingAreasStore()

const { id: selectedBuildAreaId } = storeToRefs(useSelectedBuildingAreaStore())
const { showCameraHelper } = storeToRefs(useDebugStore())

const cameraMoved = ref(false)
const showOutline = ref(false)

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

// The post-processing outline effect breaks the scene when the active camera is changed, so initialize the effect
// each time new when the camera was changed.
const { start, stop } = useTimeoutFn(() => {
  showOutline.value = true
}, 150)
watch(showCameraHelper, () => {
  stop()
  showOutline.value = false
  start()
}, {
  immediate: true,
})
</script>

<template>
  <VisualHelper />
  <CameraAndControls
    @camera-moved="() => cameraMoved = true"
  />
  <Lights />

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
      <Island
        @click="(e: TresJsClickEvent) => { e.stopPropagation() }"
      />
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
        @click="(e: TresJsClickEvent) => { e.stopPropagation() }"
      />
    </Suspense>

    <Suspense>
      <Waterfall />
    </Suspense>

    <Suspense>
      <SkyDome
        @click="(e: TresJsClickEvent) => { e.stopPropagation() }"
      />
    </Suspense>

    <Suspense>
      <SeaBed
        @click="(e: TresJsClickEvent) => { e.stopPropagation() }"
      />
    </Suspense>

    <DistanceFog />
  </TresGroup>

  <Suspense>
    <!-- using `enabled` does not work - we have to remove and set it again, otherwise the debug camera bugs -->
    <EffectComposerPmndrs
      v-if="showOutline"
    >
      <OutlinePmndrs
        :blend-function="BlendFunction.SCREEN"
        :edge-glow="10"
        :edge-strength="2000"
        hidden-edge-color="#ff0000"
        :outlined-objects="outlinedObjects"
        :pattern-scale="50"
        visible-edge-color="#c9c9c9"
        :x-ray="false"
      />
    </EffectComposerPmndrs>
  </Suspense>
</template>

<style scoped>
</style>
