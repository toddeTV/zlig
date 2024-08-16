<script setup lang="ts">
import modelLoader from '@/assets/models/japaneseSmallAssets/Bridge/Bridge.gltf'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const { nodes } = await modelLoader

const model = nodes.Bridge

registeredForSelectingModelStore.register(model)
</script>

<template>
  <primitive :object="nodes.Bridge.clone()" />
</template>

<style scoped>
</style>
