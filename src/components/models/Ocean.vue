<script setup lang="ts">
import { getNode, OceanScene } from '@/assets/models/Ocean/Ocean.gltf.js'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { getWaterMaterial } from '@/utils/WaterShader.js'
import { storeToRefs } from 'pinia'
import { shallowRef, watch } from 'vue'

const { onTick } = useGameTimeStore()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const groupWrapperRef = shallowRef()

const waterMaterial = getWaterMaterial({
  relativeHeightOffset: -0.68,
  waveAmplitude: 2.0,
  waveSpeed: 1.0,
  waveTangentialAmplitude: 1.0,
})

const model = await getNode(OceanScene.ocean001)
model.material = waterMaterial

onTick(({ ambientAnimationDelta }) => {
  waterMaterial.uniforms.time.value += ambientAnimationDelta
})

watch(showWaterWireframe, () => {
  waterMaterial.wireframe = showWaterWireframe.value
}, {
  immediate: true,
})

const { stop } = watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addShadowAndAddToGroup(newValue, model, 'receive')
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
