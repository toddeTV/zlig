<script setup lang="ts">
import modelLoader from '@/assets/models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf'

const { nodes } = await modelLoader
</script>

<template>
  <primitive :object="nodes.BambooBehindFence.clone()" />
</template>

<style scoped>
</style>
