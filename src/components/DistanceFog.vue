<script setup lang="ts">
import { Fog } from 'three'

// TODO set min and max distance correctly regarding the model size after the new model was added
// TODO set the distances correct for zoom/ dolly the camera controller nearer and further from the model
const model = new Fog(0x82DBC5, 140, 160)
</script>

<template>
  <primitive
    :object="model"
  />
</template>

<style scoped>
</style>
