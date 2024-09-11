<script setup lang="ts">
import { CameraControls } from '@tresjs/cientos'
import type { CameraControlsProps } from '@tresjs/cientos/dist/core/controls/CameraControls.vue.js'
import { ref } from 'vue'

const emit = defineEmits(['cameraMoved'])

const cameraIsActive = ref(false)

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
    left: 1, // rotate
    middle: 0, // none
    right: 8, // dolly
    wheel: 8, // dolly
  },
}
</script>

<template>
  <!-- camera -->
  <!-- TODO set far clipping on max from the model for better results (shader etc.) -->
  <TresPerspectiveCamera
    :position="[60, 60, 60]"
  />

  <!-- controls -->
  <CameraControls
    v-bind="cameraControlsProps"
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
