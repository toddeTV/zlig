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
import useGetParam from '@/composables/useGetParam'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { useLoop } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { onBeforeRender } = useLoop()
const gameTime = useGameTime()
const { areas } = storeToRefs(useBuildingAreas())
const { init } = useBuildingAreas()
const { isParamPresent } = useGetParam()

onBeforeRender(({ delta }) => {
  gameTime.tick(delta)
})

init()

const selectedBuildingArea = useSelectedBuildingArea()

const cameraMoved = ref(false)

if (isParamPresent('world') || isParamPresent('camera')) {
  gameTime.currentFactor = 0
  gameTime.currentTime.setHours(3)
}
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
    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera')">
      <Island />
    </Suspense>

    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera')">
      <BuildingArea
        v-for="area in areas"
        :id="area.id"
        :key="area.id"
        :position="area.position"
        :rotation="area.rotation"
      />
    </Suspense>

    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera')">
      <Ocean
        :position="[0, 0, 0]"
      />
    </Suspense>

    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera')">
      <Waterfall
        :position="[0, 0, 0]"
      />
    </Suspense>
  </TresGroup>
</template>

<style scoped>
</style>
