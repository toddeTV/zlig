<script setup lang="ts">
import modelLoader from '@/assets/models/Ocean/Ocean.gltf'
import useDebugStore from '@/composables/useDebugStore'
import useThreeHelper from '@/composables/useThreeHelper'
import { fragmentShader, vertexShader } from '@/constants/WaterShader'
import { useLoop, useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { addShadow } = useThreeHelper()
const { scenes } = await modelLoader
const { render } = useLoop()
const { showWaterShader } = storeToRefs(useDebugStore())

const sceneGroup = scene.value.getObjectByName('sceneGroup') ?? scene.value
const oceanScene = scenes.Ocean

addShadow(oceanScene.Object.ocean)

const uniforms = {
  time: { value: 0.0 },
}

const waterMaterial = new ShaderMaterial({
  fragmentShader,
  transparent: true,
  uniforms,
  vertexShader,
  wireframe: false,
})

const geometry = new PlaneGeometry(200, 200, 100, 100)
const waterMesh = new Mesh(geometry, waterMaterial)
waterMesh.rotation.x = -Math.PI / 2 // rotate the water
addShadow(waterMesh, 'receive') // TODO fix bc this is not working
// sceneGroup.add(waterMesh)
// addShadowAndAddToGroup(sceneGroup, waterMesh)

render(({ camera, renderer, scene }) => {
  uniforms.time.value += 0.05
  renderer.render(scene, camera)
})

watch(showWaterShader, () => {
  sceneGroup.remove(oceanScene.Object.ocean)
  sceneGroup.remove(waterMesh)
  if (showWaterShader.value) {
    sceneGroup.add(waterMesh)
    return
  }
  sceneGroup.add(oceanScene.Object.ocean)
}, {
  immediate: true,
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
