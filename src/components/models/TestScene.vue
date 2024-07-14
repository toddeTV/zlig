<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const { nodes, scene } = await useGLTF('/models/TestScene.gltf', {
  draco: true,
})
</script>

<template>
  <primitive :object="scene" />
</template>

<style scoped>
</style>
