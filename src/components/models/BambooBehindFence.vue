<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import type { BambooBehindFence } from '@/assets/models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf'

const { nodes } = await useGLTF('/models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf', {
  draco: true,
}) as unknown as BambooBehindFence
</script>

<template>
  <primitive :object="nodes.BambooBehindFence" />
</template>

<style scoped>
</style>
