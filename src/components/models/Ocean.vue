<script setup lang="ts">
import modelLoader from '@/assets/models/Ocean/Ocean.gltf'
import useDebugStore from '@/composables/useDebugStore'
import useThreeHelper from '@/composables/useThreeHelper'
import { getWaterMaterial } from '@/utils/WaterShader'
import { useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const { scene } = useTresContext()
const { addShadow, addToGroup } = useThreeHelper()
const { scenes } = await modelLoader
const { render } = useLoop()
const { showWaterWireframe } = storeToRefs(useDebugStore())

const uniforms = ref({
  time: { value: 0.0 },
})

const waterMaterial = getWaterMaterial()

scenes.Ocean.Object.ocean.material = waterMaterial
addShadow(scenes.Ocean.Object.ocean, 'receive')
addToGroup(scene.value, scenes.Ocean.Object.ocean)

render(({ camera, renderer, scene }) => {
  uniforms.value.time.value += 0.05
  waterMaterial.uniforms = uniforms.value
  renderer.render(scene, camera)
})

watch(showWaterWireframe, () => {
  waterMaterial.wireframe = showWaterWireframe.value
}, {
  immediate: true,
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
