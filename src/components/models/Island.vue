<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const { scenes } = await modelLoader

const model = scenes.Scene

Object.entries(model.traversed.Object).forEach(([key, value]) => {
  if (key.startsWith('buildArea')) {
    registeredForSelectingModelStore.register(value)
  }
})
</script>

<template>
  <primitive :object="model" />
</template>

<style scoped>
</style>
