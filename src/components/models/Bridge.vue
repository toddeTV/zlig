<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const { nodes } = await useGLTF('/models/japaneseSmallAssets/Bridge/Bridge.gltf', {
  draco: true,
})
</script>

<template>
  <primitive :object="nodes.Bridge" />
</template>

<style scoped>
</style>
