<script setup lang="ts">
import modelLoader from '@/assets/models/Waterfall/Waterfall.gltf'
import useDebugStore from '@/composables/useDebugStore'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { getWaterMaterial } from '@/utils/WaterShader'
import { useLoop } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { onMounted, ref, shallowRef, watch } from 'vue'

const { scenes } = await modelLoader
const { onBeforeRender } = useLoop()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const groupWrapperRef = shallowRef()

const uniforms = ref({
  time: { value: 0.0 },
})

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

onBeforeRender(({ delta }) => {
  if (groupWrapperRef.value.children.length === 0) {
    return
  }
  uniforms.value.time.value += delta
  groupWrapperRef.value.children.forEach((child: any) => { // TODO fix type
    if (child.material.userData.shader) {
      child.material.userData.shader.uniforms.time = uniforms.value.time
    }
  })
})

watch(showWaterWireframe, () => {
  waterMaterial.wireframe = showWaterWireframe.value
}, {
  immediate: true,
})

onMounted(() => {
  const model1 = scenes.Waterfall.Object.zligwaterfalllvl0001.clone()
  model1.material = waterMaterial
  addShadowAndAddToGroup(groupWrapperRef.value, model1, 'receive')

  const model2 = scenes.Waterfall.Object.zligwaterfalllvl1002.clone()
  model2.material = waterMaterial
  addShadowAndAddToGroup(groupWrapperRef.value, model2, 'receive')

  const model3 = scenes.Waterfall.Object.zligwaterfalllvl1_to_lvl0001.clone()
  model3.material = waterMaterialDown
  addShadowAndAddToGroup(groupWrapperRef.value, model3, 'receive')
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
