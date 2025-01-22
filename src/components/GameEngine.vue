<script setup lang="ts">
import BuildingArea from '@/components/buildings/BuildingArea.vue'
import CameraAndControls from '@/components/CameraAndControls.vue'
import DistanceFog from '@/components/DistanceFog.vue'
import Lights from '@/components/Lights.vue'
import Island from '@/components/models/Island.vue'
import Ocean from '@/components/models/Ocean.vue'
import Waterfall from '@/components/models/Waterfall.vue'
import VisualHelper from '@/components/VisualHelper.vue'
import { useBuildingAreasStore } from '@/composables/useBuildingAreasStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { useSelectedBuildingAreaStore } from '@/composables/useSelectedBuildingAreaStore.js'
import { useLoop } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { onBeforeRender } = useLoop()
const gameTime = useGameTimeStore()
const { areas } = storeToRefs(useBuildingAreasStore())
const { init } = useBuildingAreasStore()

onBeforeRender(({ delta }) => {
  gameTime.tick(delta)
})

init()

const selectedBuildingArea = useSelectedBuildingAreaStore()

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
        selectedBuildingArea.id = null
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
</template>

<style scoped>
</style>
