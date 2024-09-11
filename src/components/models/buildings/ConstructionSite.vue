<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'

const { scenes: { Scene } } = await modelLoader

// TODO: Create and use a real model here.
</script>

<template>
  <primitive
    :object="Scene.Object.buildArea00"
  />
</template>
