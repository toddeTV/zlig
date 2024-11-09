<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import useVirtualTimeStore from '@/composables/useVirtualTimeStore'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { AmbientLight, CameraHelper, DirectionalLight } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { showLightHelper } = storeToRefs(useDebugStore())
const { calculateLightBySunPosition, calculateSunPosition } = useVirtualTimeStore()
const { currentVirtualTime } = storeToRefs(useVirtualTimeStore())

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

watch(() => currentVirtualTime.value, (newValue, _oldValue) => {
  directionalLight.position.fromArray(calculateSunPosition(newValue).toArray()) // set sun position

  const { ambientColor, ambientIntensity, sunColor, sunIntensity } = calculateLightBySunPosition(directionalLight.position)

  directionalLight.intensity = sunIntensity // set sun intensity
  directionalLight.color = sunColor // set sun color
  ambientLight.intensity = ambientIntensity // set ambient light intensity
  ambientLight.color = ambientColor // set ambient color
})

// -------- CameraHelper for DirectionalLight

const helper = new CameraHelper(directionalLight.shadow.camera)
watch(() => showLightHelper.value, (newValue, _oldValue) => {
  updateHelperVisibility(newValue)
})
function updateHelperVisibility(isVisible: boolean) {
  scene.value.remove(helper)
  if (isVisible === true)
    scene.value.add(helper)
}
updateHelperVisibility(showLightHelper.value)
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
