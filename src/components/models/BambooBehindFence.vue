<script setup lang="ts">
import { useGLTF } from '@/utils/use-gltf'

const { nodes } = await useGLTF('/models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf', {
  draco: true,
})
</script>

<template>
  <primitive :object="nodes.BambooBehindFence" />
</template>

<style scoped>
</style>
