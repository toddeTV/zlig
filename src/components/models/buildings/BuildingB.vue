<script setup lang="ts">
import modelLoader from '@/assets/models/buildings/b.gltf'

const { scenes: { Scene } } = await modelLoader
</script>

<template>
  <primitive :object="Scene.Scene" :scale="1.75" />
</template>
