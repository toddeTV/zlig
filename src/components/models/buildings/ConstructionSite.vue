<script setup lang="ts">
import modelLoader from '@/assets/models/BuildArea/BuildArea.gltf'

const { scenes } = await modelLoader

// TODO: Create and use a real model here.
</script>

<template>
  <primitive
    :object="scenes.BuildArea.Object.zligbuildAreabase001.clone()"
  />
</template>
