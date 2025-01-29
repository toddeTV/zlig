<script setup lang="ts">
import { getNode, WaterfallScene } from '@/assets/models/Waterfall/Waterfall.gltf.js'
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

const model1 = await getNode(WaterfallScene.zligwaterfalllvl0001)
model1.material = waterMaterial

const model2 = await getNode(WaterfallScene.zligwaterfalllvl1002)
model2.material = waterMaterial

const model3 = await getNode(WaterfallScene.zligwaterfalllvl1_to_lvl0001)
model3.material = waterMaterialDown

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

  addShadowAndAddToGroup(newValue, model1, 'receive')
  addShadowAndAddToGroup(newValue, model2, 'receive')
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
