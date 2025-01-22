<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { shallowRef, watch } from 'vue'

const { scenes } = await modelLoader

const groupWrapperRef = shallowRef()

watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }

  const model = scenes.Island.Scene.clone()
  addShadowAndAddToGroup(newValue, model, 'both')

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
