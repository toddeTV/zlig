<script setup lang="ts">
import { computed } from 'vue'
import modelLoader from '@/assets/models/buildings/a.gltf'
import type { BuildingInstance } from '@/game-logic/buildings/types.js'

const props = defineProps<{ buildingInstance: BuildingInstance }>()

const { scenes: { Scene } } = await modelLoader

const scale = computed(() => {
  // Building A has no level limit but we cannot simply scale it forever. Clamp the scale between 1.75 and 5 (for
  // level 100).

  const min = 1.75
  const max = 5

  const minLevel = 0
  const maxLevel = 100
  const levelProgress = Math.min(maxLevel, props.buildingInstance.level) / (maxLevel - minLevel)

  return min + (max - min) * levelProgress
})
</script>

<template>
  <primitive :object="Scene.Scene.clone()" :scale />
</template>
