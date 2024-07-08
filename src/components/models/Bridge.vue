<script setup lang="ts">
import { useGLTF } from '@/utils/use-gltf'

const { nodes } = await useGLTF('/models/japaneseSmallAssets/Bridge/Bridge.gltf', {
  draco: true,
})
</script>

<template>
  <primitive :object="nodes.Bridge" />
</template>

<style scoped>
</style>
