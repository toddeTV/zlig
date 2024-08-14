<script setup lang="ts">
import modelLoader from '@/assets/models/japaneseSmallAssets/Bridge/Bridge.gltf'

const { nodes } = await modelLoader
</script>

<template>
  <primitive :object="nodes.Bridge.clone()" />
</template>

<style scoped>
</style>
