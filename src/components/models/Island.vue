<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { onMounted, shallowRef } from 'vue'

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
