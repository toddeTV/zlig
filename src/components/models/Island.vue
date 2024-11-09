<script setup lang="ts">
import modelLoader from '@/assets/models/Island/Island.gltf'
import { addShadow, addShadowAndAddToGroup, addToGroup } from '@/utils/threeHelper'
import { getWaterMaterial } from '@/utils/WaterShader'
import { useGLTF } from '@tresjs/cientos'
import { useLoop, useTresContext } from '@tresjs/core'
import { ref } from 'vue'
import type { Group, Mesh, Object3D } from 'three'

const { scene } = useTresContext()
const { scenes } = await modelLoader
const { onBeforeRender } = useLoop()

const uniforms = ref({
  time: { value: 0.0 },
})

const islandScene = scenes.Island.Scene.clone()

const lakeMaterial1 = getWaterMaterial({
  relativeHeightOffset: -0.375,
  waterColor: 0x52EBDA,
  waveAmplitude: 0.45,
  waveTangentialAmplitude: 0.0,
})
const lakePlane1 = islandScene.getObjectByName('waterfall_lvl0') as Mesh
lakePlane1.material = lakeMaterial1

const lakeMaterial2 = getWaterMaterial({
  relativeHeightOffset: -0.375,
  waterColor: 0x52EBDA,
  waveAmplitude: 0.3,
  waveTangentialAmplitude: 0.0,
})
const lakePlane2 = islandScene.getObjectByName('waterfall_lvl1') as Mesh
lakePlane2.material = lakeMaterial2

const waterfall = islandScene.getObjectByName('waterfall_lvl1_to_lvl0') as Mesh
waterfall.material = lakeMaterial2

addShadow(islandScene, 'both')

const seabedPlane = islandScene.getObjectByName('island_lvl0_seabed')!
seabedPlane.castShadow = false
seabedPlane.receiveShadow = true

addToGroup(scene.value, islandScene)

onBeforeRender(({ delta, scene }) => {
  uniforms.value.time.value += delta

  const lakePlane1 = islandScene.getObjectByName('waterfall_lvl0') as Mesh
  if (lakePlane1 && lakePlane1.material.userData.shader) {
    lakePlane1.material.userData.shader.uniforms.time = uniforms.value.time
  }

  const lakePlane2 = islandScene.getObjectByName('waterfall_lvl1') as Mesh
  if (lakePlane2 && lakePlane2.material.userData.shader) {
    lakePlane2.material.userData.shader.uniforms.time = uniforms.value.time
  }
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
