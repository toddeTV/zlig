<script setup lang="ts">
import modelLoader from '@/assets/models/Waterfall/Waterfall.gltf'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { getWaterMaterial } from '@/utils/WaterShader.js'
import { storeToRefs } from 'pinia'
import { shallowRef, watch } from 'vue'

const { scenes } = await modelLoader
const { onTick } = useGameTimeStore()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const groupWrapperRef = shallowRef()

const waterMaterial = getWaterMaterial({
  relativeHeightOffset: -0.45,
  waterColor: 0x52EBDA,
  waveAmplitude: 0.3,
  waveTangentialAmplitude: 0.0,
})

const waterMaterialDown = getWaterMaterial({
  relativeHeightOffset: 0,
  waterColor: 0x52EBDA,
  waveAmplitude: 0.1,
  waveTangentialAmplitude: 0.0,
})

onTick(({ ambientAnimationDelta }) => {
  waterMaterial.uniforms.time.value += ambientAnimationDelta
  waterMaterialDown.uniforms.time.value += ambientAnimationDelta
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

  const model1 = scenes.Waterfall.Object.zligwaterfalllvl0001.clone()
  model1.material = waterMaterial
  addShadowAndAddToGroup(newValue, model1, 'receive')

  const model2 = scenes.Waterfall.Object.zligwaterfalllvl1002.clone()
  model2.material = waterMaterial
  addShadowAndAddToGroup(newValue, model2, 'receive')

  const model3 = scenes.Waterfall.Object.zligwaterfalllvl1_to_lvl0001.clone()
  model3.material = waterMaterialDown
  addShadowAndAddToGroup(newValue, model3, 'receive')
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
