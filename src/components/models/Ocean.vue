<script setup lang="ts">
import modelLoader from '@/assets/models/Ocean/Ocean.gltf'
import useDebugStore from '@/composables/useDebugStore'
import { addShadow, addShadowAndAddToGroup, addToGroup } from '@/utils/threeHelper'
import { getWaterMaterial } from '@/utils/WaterShader'
import { type TresPrimitive, useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Group, Mesh, Plane, PlaneGeometry } from 'three'
import { onMounted, ref, shallowRef, watch } from 'vue'
import type { Object3D } from 'three'

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

onMounted(() => {
  const model = scenes.Ocean.Object.ocean001.clone()
  model.material = waterMaterial
  addShadowAndAddToGroup(groupWrapperRef.value, model, 'receive')
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
