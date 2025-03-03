<script setup lang="ts">
import { useDebugStore } from '@/composables/useDebugStore.js'
import { CameraControls } from '@tresjs/cientos'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Box3, Box3Helper, CameraHelper, PerspectiveCamera, Vector3 } from 'three'
import { ref, shallowRef, watch } from 'vue'
import type { CameraControlsProps } from '@tresjs/cientos/dist/core/controls/CameraControls.vue.js'

// TODO refactor: split in three components: Controller, NormalCamera (emits to Controller), DebugCamera (emits to Controller)

const emit = defineEmits(['cameraMoved'])

const { registerCamera, scene, setCameraActive } = useTresContext()
const { showCameraHelper } = storeToRefs(useDebugStore())

const cameraIsBeingMoved = ref(false)

const cameraControlsRef = shallowRef<InstanceType<typeof CameraControls>>()
const debugCameraControlsRef = shallowRef<InstanceType<typeof CameraControls>>()

// Camera settings
const cameraStartingPosition = new Vector3(60, 60, 60)
const cameraRotateSpeed = 0.3
const cameraBoundary = new Box3( // TODO would be nice to have a sphere boundary: `new Sphere(new Vector3(0, 0, 0), 50)`
  // 25 units in each direction from the center
  new Vector3(-25, 0.1, -25),
  new Vector3(25, 25, 25),
)

// create a perspective camera that will override the default camera that TresJS creates
const perspectiveCamera = ref(new PerspectiveCamera())
perspectiveCamera.value.position.fromArray(cameraStartingPosition.toArray())
perspectiveCamera.value.far = 270
registerCamera(perspectiveCamera.value)

// create a perspective camera as debug camera
const perspectiveDebugCamera = ref(perspectiveCamera.value.clone()) // clone to set the same settings as the normal camera as default
perspectiveDebugCamera.value.far = 2000
registerCamera(perspectiveDebugCamera.value)

// create helper boxes for showing in debug
const cameraHelper = new CameraHelper(perspectiveCamera.value)
const boxHelper = new Box3Helper(cameraBoundary)

// camera control settings
const cameraControlsProps = ref<CameraControlsProps>({
  /* eslint-disable perfectionist/sort-objects */
  makeDefault: true,
  camera: perspectiveCamera.value,

  // rotation speed
  azimuthRotateSpeed: cameraRotateSpeed,
  polarRotateSpeed: cameraRotateSpeed,

  // dolly distance
  minDistance: 20,
  maxDistance: 100,
  distance: 80,

  // polar angle
  minPolarAngle: Math.PI * 0.2,
  maxPolarAngle: Math.PI * 0.45,

  // controls for mouse
  mouseButtons: {
    left: 1, // = rotate
    middle: 0, // = none
    right: 2, // = truck
    wheel: 8, // = dolly
  },

  // controls for tough
  touches: {
    one: 0, // = none
    two: 1024, // = TOUCH_DOLLY_TRUCK
    three: 0, // = none
  },
  /* eslint-enable */
})

// camera control settings
const debugCameraControlsProps = ref<CameraControlsProps>({
  ...cameraControlsProps.value, // inherit from the normal camera as defaults for similar feel of movement etc.

  /* eslint-disable perfectionist/sort-objects */
  camera: perspectiveDebugCamera.value,

  // dolly distance
  minDistance: undefined, // override the default for no restrictions
  maxDistance: undefined, // override the default for no restrictions
  distance: undefined, // override the default for no restrictions

  // polar angle
  minPolarAngle: undefined, // override the default for no restrictions
  maxPolarAngle: undefined, // override the default for no restrictions
  /* eslint-enable */
})

// store to cache the camera position, rotation & lookAt when switching to the debug camera
const cameraCache = ref({
  // default values for the first initialization of the normal camera
  position: cameraStartingPosition.clone(),
  target: new Vector3(10, 10, 0),
})

// watch for camera helper visibility for switching between normal and debug camera.
// the watcher of the ShalloRef's of the two will trigger afterwards and set some properties for the cameras & controls.
watch(showCameraHelper, (newValue) => {
  if (newValue === true) { // now show debug camera
    // show box helpers
    scene.value.add(cameraHelper)
    scene.value.add(boxHelper)

    // cache the normal camera position & rotation
    if (cameraControlsRef.value && cameraControlsRef.value.instance) {
      cameraControlsRef.value.instance.getPosition(cameraCache.value.position)
      cameraControlsRef.value.instance.getTarget(cameraCache.value.target)
    }

    // set the debug camera as active
    setCameraActive(perspectiveDebugCamera.value.uuid)
  }
  else if (newValue === false || newValue === undefined) { // now show normal camera
    // hide box helpers
    scene.value.remove(cameraHelper)
    scene.value.remove(boxHelper)

    // set the normal camera as active
    setCameraActive(perspectiveCamera.value.uuid)
  }
  else {
    throw new Error('Invalid value for `showCameraHelper`')
  }
}, {
  immediate: true, // to override the default TresJS camera by one of out cameras
})

// init default camera with controls by setting restrictions & first view direction
watch(() => cameraControlsRef.value?.instance, (newValue) => {
  if (!newValue) {
    return
  }

  // Set camera boundary
  newValue.setBoundary(cameraBoundary)

  // set cameraCache values
  newValue.setLookAt(
    cameraCache.value.position.x,
    cameraCache.value.position.y,
    cameraCache.value.position.z,
    cameraCache.value.target.x,
    cameraCache.value.target.y,
    cameraCache.value.target.z,
  )
  newValue.setPosition(
    cameraCache.value.position.x,
    cameraCache.value.position.y,
    cameraCache.value.position.z,
  )
}, {
  immediate: true,
})

watch(() => debugCameraControlsRef.value?.instance, (newValue) => {
  if (!newValue) {
    return
  }

  // use the normal camera position & rotation to calculate a position for the debug camera that is behind the normal one
  const normalCameraPosition = perspectiveCamera.value.position.clone()
  const forward = new Vector3()
  perspectiveCamera.value.getWorldDirection(forward)
  const right = new Vector3()
  right.crossVectors(forward, perspectiveCamera.value.up).normalize()
  const newPosition = normalCameraPosition
    .sub(forward.multiplyScalar(150))
    .sub(right.multiplyScalar(20))
  newValue.setPosition(newPosition.x, newPosition.y, newPosition.z)
}, {
  immediate: true,
})
</script>

<template>
  <TresGroup>
    <!-- TODO make this imperative and add to `script` above in order to get rid of the back binding with `ref` -->
    <CameraControls
      v-if="!showCameraHelper"
      v-bind="cameraControlsProps"
      ref="cameraControlsRef"
      @change="() => {
        if (cameraIsBeingMoved){
          emit('cameraMoved')
          // Reset the value here ahead of the end event to only trigger the event once.
          cameraIsBeingMoved = false
        }
      }"
      @end="() => cameraIsBeingMoved = false"
      @start="() => cameraIsBeingMoved = true"
    />
    <CameraControls
      v-if="showCameraHelper"
      v-bind="debugCameraControlsProps"
      ref="debugCameraControlsRef"
      @change="() => {
        if (cameraIsBeingMoved){
          emit('cameraMoved')
          // Reset the value here ahead of the end event to only trigger the event once.
          cameraIsBeingMoved = false
        }
      }"
      @end="() => cameraIsBeingMoved = false"
      @start="() => cameraIsBeingMoved = true"
    />
  </TresGroup>
</template>

<style scoped>
</style>
