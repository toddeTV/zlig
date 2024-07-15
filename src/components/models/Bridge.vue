<script setup lang="ts">
import useGLTF from '@/composables/useGLTF'

const { nodes } = await useGLTF('/models/japaneseSmallAssets/Bridge/Bridge.gltf')
</script>

<template>
  <primitive :object="nodes.Bridge" />
</template>

<style scoped>
</style>
