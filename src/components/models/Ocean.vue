<script setup lang="ts">
import { useDebugStore } from '@/composables/useDebugStore.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { getWaterMaterial } from '@/utils/WaterShader.js'
import { storeToRefs } from 'pinia'
import { Mesh, PlaneGeometry } from 'three'
import { shallowRef, watch } from 'vue'

const { onTick } = useGameTimeStore()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const groupWrapperRef = shallowRef()

const waterMaterial = getWaterMaterial({
  fogActive: true,
  relativeHeightOffset: -1,
  waterSwingDirection: 'xy',
  waveAmplitude: 2.0,
  waveSpeed: 1.0,
  waveTangentialAmplitude: -1.0,
})

const geometry = new PlaneGeometry(350, 350, 200, 200)
const model = new Mesh(geometry, waterMaterial)
model.rotation.x = -Math.PI / 2

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
  addShadowAndAddToGroup(newValue, model, 'receive', true)
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
