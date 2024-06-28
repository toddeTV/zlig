<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const { scene } = await useGLTF('/models/japaneseSmallAssets/SM_Bridge_01/SM_Bridge_01.gltf', {
  draco: true,
})
</script>

<template>
  <primitive :object="scene" />
</template>

<style scoped>
</style>
