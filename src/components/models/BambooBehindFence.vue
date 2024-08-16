<script setup lang="ts">
import modelLoader from '@/assets/models/japaneseSmallAssets/BambooBehindFence/BambooBehindFence.gltf'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const { nodes } = await modelLoader

const model = nodes.BambooBehindFence

registeredForSelectingModelStore.register(model)
</script>

<template>
  <primitive :object="nodes.BambooBehindFence.clone()" />
</template>

<style scoped>
</style>
