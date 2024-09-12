<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import useVirtualTimeStore from '@/composables/useVirtualTimeStore'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { AmbientLight, CameraHelper, Color, DirectionalLight, Vector3 } from 'three'
import { onMounted, watch } from 'vue'

const { scene } = useTresContext()
const { showLightHelper } = storeToRefs(useDebugStore())
const { currentVirtualTime } = storeToRefs(useVirtualTimeStore())

// -------- AmbientLight

const ambientLight = new AmbientLight(0xFFFFFF, 0)
scene.value.add(ambientLight)

// -------- DirectionalLight

const directionalLight = new DirectionalLight(0xFFFFFF, 0)
directionalLight.castShadow = true
directionalLight.position.set(-10, 20, 20)

directionalLight.shadow.mapSize.width = 1024 * 2 // more beautiful, but performance heavier
directionalLight.shadow.mapSize.height = 1024 * 2

directionalLight.shadow.bias = -0.01 // fine tune to reduce shadow artifacts (negative and as close to 0 as possible)

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

// -------- simulate sun rotation

const a = 50 // Semi-major axis along the X-axis
const b = 25 // Semi-minor axis along the Y-axis

// Function to map a value between a range
function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

// TODO refactor: find better color, intensity, ellipse, etc. values
function updateSunPosition() {
  const currentTimeInSeconds = currentVirtualTime.value.getTime() / 1000 // seconds

  // Calculate the angle (here you scale the time to a full cycle in a virtual "day")
  const theta = (currentTimeInSeconds * 2 * Math.PI) / (24 * 3600) // One full cycle per "virtual day"

  // Calculate the light's position on the ellipse
  const x = a * Math.cos(theta)
  const y = b * Math.sin(theta)

  // Set the new position of the light (y is used here to change the height)
  directionalLight.position.set(x, y, 100) // Z can be constant or also part of the ellipse

  // The light should point from the "sun" to the center
  directionalLight.lookAt(new Vector3(0, 0, 0))

  // Adjust the light intensity based on the height of the "sun" (y value) ...
  const normalizedYDirectional = mapRange(y, -b, b, 0, 2) // Normalize the height between values
  directionalLight.intensity = mapRange(normalizedYDirectional, 0, 1, 0.2, 1) // Lower intensity at sunrise/sunset, max at noon

  // ... same for the ambient light
  const normalizedYAmbient = mapRange(y, -b, b, 0.1, 0.5) // Normalize the height between values
  ambientLight.intensity = mapRange(normalizedYAmbient, 0, 1, 0.2, 1) // Lower intensity at sunrise/sunset, max at noon

  // Adjust the light color based on the height of the "sun"
  const color = new Color()
  color.setHSL(mapRange(normalizedYDirectional, 0, 1, 0.05, 0.15), 1, 0.5) // More red in the morning/evening, yellow at noon
  directionalLight.color.set(color)
}

// TODO must be done with the render loop per frame - same with the virtual time itself
onMounted(() => {
  setInterval(() => {
    updateSunPosition()
  }, 100)
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
