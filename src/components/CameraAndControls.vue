<script setup lang="ts">
import { CameraControls } from '@tresjs/cientos'
import { useTresContext } from '@tresjs/core'
import { PerspectiveCamera } from 'three'
import type { CameraControlsProps } from '@tresjs/cientos/dist/core/controls/CameraControls.vue.js'

const { setCameraActive } = useTresContext()

const rotateSpeed = 0.3

/* eslint-disable perfectionist/sort-objects */
const cameraControlsProps: CameraControlsProps = {
  makeDefault: true,

  azimuthRotateSpeed: rotateSpeed,
  polarRotateSpeed: rotateSpeed,

  minDistance: 50,
  maxDistance: 100,

  minPolarAngle: Math.PI * 0.2,
  maxPolarAngle: Math.PI * 0.45,

  mouseButtons: {
    left: 1, // = rotate
    middle: 0, // = none
    right: 8, // = dolly
    wheel: 8, // = dolly
  },
}

const perspectiveCamera = new PerspectiveCamera()
perspectiveCamera.position.set(60, 60, 60)
perspectiveCamera.far = 200 // should be further away than when the model is max zoomed regarding fog distance

// scene.value.add(perspectiveCamera)
setCameraActive(perspectiveCamera)

// const helper = new CameraHelper(perspectiveCamera)
// scene.value.add(helper)
</script>

<template>
  <!--
    We use `CameraControls` from `@tresjs/cientos`
      https://github.com/Tresjs/cientos/blob/main/src/core/controls/CameraControls.vue
    in order to not wrap the original third party library
      https://github.com/yomotsu/camera-controls
  -->
  <CameraControls
    v-bind="cameraControlsProps"
  />
</template>

<style scoped>
</style>
