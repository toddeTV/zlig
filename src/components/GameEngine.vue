<script setup lang="ts">
import BuildingArea from '@/components/buildings/BuildingArea.vue'
import CameraAndControls from '@/components/CameraAndControls.vue'
import DistanceFog from '@/components/DistanceFog.vue'
import Lights from '@/components/Lights.vue'
import Windmill from '@/components/models/buildings/Windmill.vue'
import Island from '@/components/models/Island.vue'
import Ocean from '@/components/models/Ocean.vue'
import Waterfall from '@/components/models/Waterfall.vue'
import VisualHelper from '@/components/VisualHelper.vue'
import useBuildingAreas from '@/composables/useBuildingAreas.js'
import useGameTime from '@/composables/useGameTime.js'
import useGetParam from '@/composables/useGetParam'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { CameraHelper, DirectionalLight, Euler, Vector3 } from 'three'
import { ref } from 'vue'

const { onBeforeRender } = useLoop()
const gameTime = useGameTime()
const { areas } = storeToRefs(useBuildingAreas())
const { init } = useBuildingAreas()
const { isParamPresent } = useGetParam()
const { scene } = useTresContext()

onBeforeRender(({ delta }) => {
  gameTime.tick(delta)
})

init()

const selectedBuildingArea = useSelectedBuildingArea()

const cameraMoved = ref(false)

if (isParamPresent('world') || isParamPresent('camera') || isParamPresent('lights')) {
  gameTime.currentFactor = 0
  gameTime.currentTime.setHours(3)
}

if (isParamPresent('lights')) {
  const directionalLight = new DirectionalLight(0xFFFFFF, 0)
  directionalLight.position.set(-0.5, 3, 5)
  directionalLight.castShadow = true

  // directionalLight.shadow.mapSize.width = 1024 * 1 // more beautiful, but performance heavier
  // directionalLight.shadow.mapSize.height = 1024 * 1

  // directionalLight.shadow.bias = -0.01 // fine tune to reduce shadow artifacts (negative and as close to 0 as possible)

  directionalLight.shadow.camera.near = 3
  directionalLight.shadow.camera.far = 12
  directionalLight.shadow.camera.left = -3
  directionalLight.shadow.camera.right = 3
  directionalLight.shadow.camera.top = 3
  directionalLight.shadow.camera.bottom = -3

  const directionalLightHelper = new CameraHelper(directionalLight.shadow.camera)

  scene.value.add(directionalLight)
  scene.value.add(directionalLightHelper)
}

const windmillPosition = new Vector3(0, 0, 0)
const windmillRotation = new Euler(0, 0, 0)

// if (isParamPresent('models')) {
// }
</script>

<template>
  <VisualHelper />
  <CameraAndControls
    @camera-moved="() => cameraMoved = true"
  />
  <Lights />
  <DistanceFog />

  <TresMesh
    v-if="isParamPresent('meshes') && !isParamPresent('models')"
    :cast-shadow="isParamPresent('shadows')"
    :position="[0, 1, 0]"
  >
    <TresBoxGeometry :args="[2, 2, 2]" />
    <!-- <TresMeshToonMaterial color="#ab2657" /> -->
    <TresMeshNormalMaterial />
  </TresMesh>

  <TresMesh
    v-if="isParamPresent('meshes') && !isParamPresent('models')"
    :position="[0, 0, 0]"
    :receive-shadow="isParamPresent('shadows')"
    :rotation="[-Math.PI / 2, 0, 0]"
  >
    <TresPlaneGeometry :args="[10, 10, 1]" />
    <TresMeshToonMaterial color="#fefefe" />
  </TresMesh>

  <Suspense
    v-if="isParamPresent('models')"
  >
    <Windmill
      building-area-id=""
      :building-instance="undefined"
      :no-animation="!isParamPresent('animations')"
      :position="windmillPosition"
      :rotation="windmillRotation"
    />
  </Suspense>

  <TresGroup
    name="sceneGroup"
    @click="() => {
      if (!cameraMoved) {
        selectedBuildingArea.id = null
      }
    }"
    @pointer-down="() => cameraMoved = false"
  >
    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera') && !isParamPresent('lights')">
      <Island />
    </Suspense>

    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera') && !isParamPresent('lights')">
      <BuildingArea
        v-for="area in areas"
        :id="area.id"
        :key="area.id"
        :position="area.position"
        :rotation="area.rotation"
      />
    </Suspense>

    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera') && !isParamPresent('lights')">
      <Ocean
        :position="[0, 0, 0]"
      />
    </Suspense>

    <Suspense v-if="!isParamPresent('world') && !isParamPresent('camera') && !isParamPresent('lights')">
      <Waterfall
        :position="[0, 0, 0]"
      />
    </Suspense>
  </TresGroup>
</template>

<style scoped>
</style>
