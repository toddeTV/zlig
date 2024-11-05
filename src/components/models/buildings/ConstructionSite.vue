<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'

const { scenes: { Island } } = await modelLoader

// TODO: Create and use a real model here.
</script>

<template>
  <primitive
    :object="Island.Object.buildArea00.clone()"
  />
</template>
