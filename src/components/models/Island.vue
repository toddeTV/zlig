<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'

const { scenes: { Scene } } = await modelLoader
</script>

<template>
  <primitive :object="Scene.Object.beach" />
  <primitive :object="Scene.Object.lvl0" />
  <primitive :object="Scene.Object.lvl1" />
  <primitive :object="Scene.Object.lvl2" />
  <primitive :object="Scene.Object.mountain" />
  <primitive :object="Scene.Object.underWaterOutline" />
  <primitive :object="Scene.Object.water" />
</template>

<style scoped>
</style>
