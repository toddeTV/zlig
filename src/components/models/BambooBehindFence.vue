<script setup lang="ts">
import useGLTF from '@/composables/useGLTF'

const { nodes } = await useGLTF('/models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf')
</script>

<template>
  <primitive :object="nodes.BambooBehindFence" />
</template>

<style scoped>
</style>
