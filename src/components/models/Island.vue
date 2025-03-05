<script setup lang="ts">
import { getNode, IslandScene } from '@/assets/models/Island/Island.gltf.js'
import { addShadowAndAddToGroup, overrideFogShader, removeFogDependence } from '@/utils/threeHelper.js'
import { Mesh, MeshStandardMaterial } from 'three'
import { shallowRef, watch } from 'vue'
import type { Group, Material } from 'three'

const model = await getNode(IslandScene)

const groupWrapperRef = shallowRef()

const { stop } = watch(groupWrapperRef, (newValue: Group | undefined) => {
  if (!newValue) {
    return
  }
  addShadowAndAddToGroup(newValue, model, 'both')
  stop()
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
