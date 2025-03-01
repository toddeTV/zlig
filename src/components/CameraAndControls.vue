<script setup lang="ts">
import { useDebugStore } from '@/composables/useDebugStore.js'
import { CameraControls } from '@tresjs/cientos'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Box3, Box3Helper, CameraHelper, PerspectiveCamera, Vector3 } from 'three'
import { ref, shallowRef, watch } from 'vue'
import type { CameraControlsProps } from '@tresjs/cientos/dist/core/controls/CameraControls.vue.js'

const emit = defineEmits(['cameraMoved'])

const { scene, setCameraActive } = useTresContext()
const { showCameraHelper } = storeToRefs(useDebugStore())

const cameraIsActive = ref(false)

const cameraControlsRef = shallowRef<InstanceType<typeof CameraControls>>()

const cameraStartingPosition = new Vector3(60, 60, 60)
const cameraRotateSpeed = 0.3
// const cameraBoundary = new Sphere(new Vector3(0, 0, 0), 100)
const cameraBoundary = new Box3(
  new Vector3(-25, 0.1, -25),
  new Vector3(25, 25, 25),
)

/* eslint-disable perfectionist/sort-objects */
const cameraControlsProps: CameraControlsProps = {
  makeDefault: true,

  azimuthRotateSpeed: cameraRotateSpeed,
  polarRotateSpeed: cameraRotateSpeed,

  minDistance: 20,
  maxDistance: 100,
  distance: 80,

  minPolarAngle: Math.PI * 0.2,
  maxPolarAngle: Math.PI * 0.45,

  mouseButtons: {
    left: 1, // = rotate
    middle: 0, // = none
    right: 2, // = truck
    wheel: 8, // = dolly
  },

  touches: {
    one: 0, // = none
    two: 1024, // = TOUCH_DOLLY_TRUCK
    three: 0, // = none
  },
}
/* eslint-enable */

const perspectiveCamera = new PerspectiveCamera()
perspectiveCamera.position.fromArray(cameraStartingPosition.toArray())
perspectiveCamera.far = 200

watch(cameraControlsRef, (newValue) => {
  if (!newValue || !newValue.instance) {
    return
  }

  // Set camera boundary
  newValue.instance.setBoundary(cameraBoundary)

  // Set look at target (which also sets the viewing angle)
  const lookAtTarget = new Vector3(10, 10, 0)
  newValue.instance.setLookAt(
    cameraStartingPosition.x,
    cameraStartingPosition.y,
    cameraStartingPosition.z,
    lookAtTarget.x,
    lookAtTarget.y,
    lookAtTarget.z,
  )
})

const perspectiveCameraHelper = ref()
const cameraHelper = new CameraHelper(perspectiveCamera)
const boxHelper = new Box3Helper(cameraBoundary)
watch(showCameraHelper, (newValue) => {
  setCameraActive(perspectiveCamera)
  scene.value.remove(cameraHelper)
  scene.value.remove(boxHelper)
  if (newValue === true) {
    perspectiveCameraHelper.value = perspectiveCamera.clone()
    perspectiveCameraHelper.value.far = 1000
    setCameraActive(perspectiveCameraHelper.value)
    scene.value.add(cameraHelper)
    scene.value.add(boxHelper)
  }
}, {
  immediate: true,
})
</script>

<template>
  <!-- TODO make this imperative and add to `script` above in order to get rid of the back binding with `ref` -->
  <!-- TODO also, there is a bug: going in debug and back removes the max zoom out -> maybe with imperative code this is fixes? -->
  <CameraControls
    v-bind="cameraControlsProps"
    ref="cameraControlsRef"
    @change="() => {
      if (cameraIsActive){
        emit('cameraMoved')
        // Reset the value here ahead of the end event to only trigger the event once.
        cameraIsActive = false
      }
    }"
    @end="() => cameraIsActive = false"
    @start="() => cameraIsActive = true"
  />
</template>

<style scoped>
</style>
