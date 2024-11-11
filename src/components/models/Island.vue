<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import { addShadow, addShadowAndAddToGroup, addToGroup } from '@/utils/threeHelper'
import { getWaterMaterial } from '@/utils/WaterShader'
import { useGLTF } from '@tresjs/cientos'
import { useLoop, useTresContext } from '@tresjs/core'
import { onMounted, ref, shallowRef } from 'vue'
import type { Group, Mesh, Object3D } from 'three'

const { scenes } = await modelLoader

const groupWrapperRef = shallowRef()

onMounted(() => {
  const model = scenes.Island.Scene.clone()
  addShadowAndAddToGroup(groupWrapperRef.value, model, 'both')

  // TODO do not use `getObjectByName` bc a string is not catched when name changes
  const seabedPlane = model.getObjectByName('zligislandlvl0_seabed001')
  if (!seabedPlane) {
    return
  }
  seabedPlane.receiveShadow = false
  seabedPlane.castShadow = false
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
