<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const { nodes } = await (useGLTF('/models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf', {
  draco: true,
}) as typeof import('models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf').default)
</script>

<template>
  <primitive :object="nodes.BambooBehindFence" />
</template>

<style scoped>
</style>
