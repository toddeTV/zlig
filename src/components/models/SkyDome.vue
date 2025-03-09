<script setup lang="ts">
import { getNode, SkyDomeScene } from '@/assets/models/SkyDome/SkyDome.gltf.js'
import { useCalculatedLightsStore } from '@/composables/useCalculatedLightsStore.js'
import { addToGroup } from '@/utils/threeHelper.js'
import { storeToRefs } from 'pinia'
import { MeshBasicMaterial } from 'three'
import { shallowRef, watch } from 'vue'

const { lightColors } = storeToRefs(useCalculatedLightsStore())

const groupWrapperRef = shallowRef()

const material = new MeshBasicMaterial({
  color: lightColors.value.sky,
})

const model = await getNode(SkyDomeScene.Sphere)
model.material = material

const { stop } = watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addToGroup(newValue, model)
  stop()
})

watch(() => lightColors.value.sky, (newValue) => {
  material.color = newValue
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
