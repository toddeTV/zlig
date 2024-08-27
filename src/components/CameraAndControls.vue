<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
</script>

<template>
  <!-- camera -->
  <!-- TODO set far clipping on max from the model for better results (shader etc.) -->
  <TresPerspectiveCamera
    :position="[35, 35, 35]"
  />

  <!-- controls -->
  <OrbitControls />
</template>

<style scoped>
</style>
