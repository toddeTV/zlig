<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import useVirtualTimeStore from '@/composables/useVirtualTimeStore'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { AmbientLight, CameraHelper, DirectionalLight, Vector3 } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { showLightHelper } = storeToRefs(useDebugStore())
const { calculateSunIntensity, calculateSunPosition } = useVirtualTimeStore()
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
  // set sun position
  directionalLight.position.fromArray(calculateSunPosition(newValue).toArray())
  directionalLight.lookAt(new Vector3(0, 0, 0))

  // set sun intensity
  directionalLight.intensity = calculateSunIntensity(directionalLight.position, 0, 2)

  // set ambient light intensity
  ambientLight.intensity = calculateSunIntensity(directionalLight.position, 0.1, 0.5)

  // TODO add light color adjustment based on the virtual time
  // Adjust the light color based on the height of the "sun"
  // const lightTransitions: TimeColorTransition[] = [
  //   //...
  // ]
  // const colorRGB = getColorByTime(newValue, lightTransitions)
  // const color = new Color()
  // color.set(rgbToHex(colorRGB))
  // directionalLight.color.set(color)
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
