<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import type { Bridge } from '@/assets/models/japaneseSmallAssets/Bridge/Bridge.gltf'

const { nodes } = await useGLTF('/models/japaneseSmallAssets/Bridge/Bridge.gltf', {
  draco: true,
}) as unknown as Bridge
</script>

<template>
  <primitive :object="nodes.Bridge" />
</template>

<style scoped>
</style>
