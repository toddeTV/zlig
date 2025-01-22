<script setup lang="ts">
import modelLoader from '@/assets/models/Ocean/Ocean.gltf'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { getWaterMaterial } from '@/utils/WaterShader.js'
import { useLoop } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { ref, shallowRef, watch } from 'vue'

const { scenes } = await modelLoader
const { onBeforeRender } = useLoop()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const groupWrapperRef = shallowRef()

const uniforms = ref({
  time: { value: 0.0 },
})

const waterMaterial = getWaterMaterial({
  relativeHeightOffset: -0.68,
  waveAmplitude: 2.0,
  waveSpeed: 1.0,
  waveTangentialAmplitude: 1.0,
})

// Use the real game tick and not the `useGameTime` tick bc the ocean should always move with the same speed
// and should not depend on the in game time/ speed.
onBeforeRender(({ delta }) => {
  if (groupWrapperRef.value.children.length === 0) {
    return
  }
  if (!groupWrapperRef.value.children[0].material.userData.shader) {
    return
  }
  uniforms.value.time.value += delta
  groupWrapperRef.value.children[0].material.userData.shader.uniforms.time = uniforms.value.time
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
