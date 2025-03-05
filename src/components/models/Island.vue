<script setup lang="ts">
import { getNode, IslandScene } from '@/assets/models/Island/Island.gltf.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { shallowRef, watch } from 'vue'
import type { Group } from 'three'

const model = await getNode(IslandScene)
const seabedPlane = await getNode(IslandScene.zligislandlvl0_seabed001)
seabedPlane.receiveShadow = false
seabedPlane.castShadow = false

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
