<script setup lang="ts">
import modelLoader from '@/assets/models/buildings/b.gltf'
import { computed } from 'vue'
import type { BuildingInstance } from '@/game-logic/buildings/types.js'

const props = defineProps<{ buildingInstance: BuildingInstance }>()

const { scenes: { Scene } } = await modelLoader

const scale = computed(() => {
  // Building B has limited levels so just scale it linearly.
  return 1.75 * props.buildingInstance.level
})
</script>

<template>
  <primitive :object="Scene.Scene.clone()" :scale />
</template>
