<script setup lang="ts">
import { getNode, IslandScene } from '@/assets/models/Island/Island.gltf.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { type Group, Mesh } from 'three'
import { shallowRef, watch } from 'vue'

const model = await getNode(IslandScene)

const groupWrapperRef = shallowRef()

const { stop } = watch(groupWrapperRef, (newValue: Group | undefined) => {
  if (!newValue) {
    return
  }

  // TODO add this in the blender model and not in the code
  model.traverse((child) => {
    if (child instanceof Mesh) {
      // flat shading
      child.material.flatShading = true

      // change grass color
      if (child.material.name === 'grass') {
        child.material.color.r = 0.149
        child.material.color.g = 0.847
        child.material.color.b = 0.515
      }
    }
  })

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
