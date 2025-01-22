<script setup lang="ts">
import useCalculatedLights from '@/composables/useCalculatedLightsStore.js'
import useDebugStore from '@/composables/useDebugStore.js'
import useSunPosition from '@/composables/useSunPositionStore.js'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { AmbientLight, CameraHelper, DirectionalLight } from 'three'
import { watch, watchEffect } from 'vue'

const { scene } = useTresContext()
const { showLightHelper } = storeToRefs(useDebugStore())
const { sunPosition } = storeToRefs(useSunPosition())
const { ambientIntensity, lightColors, sunIntensity } = storeToRefs(useCalculatedLights())

// -------- AmbientLight

const ambientLight = new AmbientLight(0xFFFFFF, 0)
scene.value.add(ambientLight)

// -------- DirectionalLight

const directionalLight = new DirectionalLight(0xFFFFFF, 0)
directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 1024 * 2 // more beautiful, but performance heavier
directionalLight.shadow.mapSize.height = 1024 * 2

directionalLight.shadow.bias = -0.004 // fine tune to reduce shadow artifacts (negative and as close to 0 as possible)

directionalLight.shadow.camera.near = 10
directionalLight.shadow.camera.far = 250
directionalLight.shadow.camera.left = -35
directionalLight.shadow.camera.right = 30
directionalLight.shadow.camera.top = 30
directionalLight.shadow.camera.bottom = -15

// directionalLight.shadow.camera.updateProjectionMatrix()
// // directionalLight.shadow.needsUpdate = true
// directionalLight.shadow.updateMatrices(directionalLight)

scene.value.add(directionalLight)

// -------- watch the time and simulate the sun

watchEffect(() => directionalLight.position.fromArray(sunPosition.value.toArray()))
watchEffect(() => directionalLight.intensity = sunIntensity.value)
watchEffect(() => directionalLight.color = lightColors.value.sun)
watchEffect(() => ambientLight.intensity = ambientIntensity.value)
watchEffect(() => ambientLight.color = lightColors.value.ambient)

// -------- CameraHelper for DirectionalLight

const helper = new CameraHelper(directionalLight.shadow.camera)
watch(showLightHelper, (newValue) => {
  scene.value.remove(helper)
  if (newValue === true)
    scene.value.add(helper)
}, {
  immediate: true,
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
