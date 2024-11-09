<script setup lang="ts">
import modelLoader from '@/assets/models/Ocean/Ocean.gltf'
import useDebugStore from '@/composables/useDebugStore'
import { addShadow, addToGroup } from '@/utils/threeHelper'
import { getWaterMaterial } from '@/utils/WaterShader'
import { type TresPrimitive, useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Group, Mesh, PlaneGeometry } from 'three'
import { onMounted, ref, shallowRef, watch } from 'vue'
import type { Object3D } from 'three'

const { scenes } = await modelLoader
const { onBeforeRender } = useLoop()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const obj = shallowRef<TresPrimitive>()

const uniforms = ref({
  time: { value: 0.0 },
})

const oceanMaterial = getWaterMaterial({
  waveSpeed: 0.8,
  waveTangentialAmplitude: 1.0,
})

onBeforeRender(({ delta, scene }) => {
  if (!obj.value || !obj.value.material.userData.shader) {
    return
  }
  uniforms.value.time.value += delta
  obj.value.material.userData.shader.uniforms.time = uniforms.value.time
})

watch(showWaterWireframe, () => {
  oceanMaterial.wireframe = showWaterWireframe.value
}, {
  immediate: true,
})

onMounted(() => {
  if (!obj.value) {
    return
  }
  obj.value.material = oceanMaterial
  obj.value.position.y += 0.18 // move water plane right up to the edge of the beach as the waves are all lower than this
  addShadow(obj.value, 'receive')
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
  <primitive
    ref="obj"
    :object="scenes.Ocean.Object.ocean001.clone()"
  />
</template>

<style scoped>
</style>
