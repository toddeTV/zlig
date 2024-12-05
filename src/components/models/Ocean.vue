<script setup lang="ts">
import modelLoader from '@/assets/models/Ocean/Ocean.gltf'
import useDebugStore from '@/composables/useDebugStore'
import useGameTime from '@/composables/useGameTime.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { getWaterMaterial } from '@/utils/WaterShader'
import { storeToRefs } from 'pinia'
import { shallowRef, watch } from 'vue'

const { scenes } = await modelLoader
const { onTick } = useGameTime()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const groupWrapperRef = shallowRef()

const waterMaterial = getWaterMaterial({
  relativeHeightOffset: -0.68,
  waveAmplitude: 2.0,
  waveSpeed: 1.0,
  waveTangentialAmplitude: 1.0,
})

onTick(({ ambientAnimationDelta }) => {
  waterMaterial.userData.shader.uniforms.time.value += ambientAnimationDelta
})

watch(showWaterWireframe, () => {
  waterMaterial.wireframe = showWaterWireframe.value
}, {
  immediate: true,
})

watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  const model = scenes.Ocean.Object.ocean001.clone()
  model.material = waterMaterial
  addShadowAndAddToGroup(newValue, model, 'receive')
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
