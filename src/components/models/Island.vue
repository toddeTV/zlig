<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const { scenes } = await modelLoader

const scene = scenes.Island

Object.entries(scene.Object).forEach(([key, value]) => {
  if (key.startsWith('buildArea')) {
    registeredForSelectingModelStore.register(value)
  }
})
</script>

<template>
  <primitive :object="scene.Scene" />
</template>

<style scoped>
</style>
