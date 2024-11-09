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
const lakePlane1 = islandScene.getObjectByName('zligwaterfalllvl0001') as Mesh
lakePlane1.material = lakeMaterial1

const lakeMaterial2 = getWaterMaterial({
  relativeHeightOffset: -0.375,
  waterColor: 0x52EBDA,
  waveAmplitude: 0.3,
  waveTangentialAmplitude: 0.0,
})
const lakePlane2 = islandScene.getObjectByName('zligwaterfalllvl1001') as Mesh
lakePlane2.material = lakeMaterial2

const waterfall = islandScene.getObjectByName('zligwaterfalllvl1_to_lvl0001') as Mesh
waterfall.material = lakeMaterial2

addShadow(islandScene, 'both')

const seabedPlane = islandScene.getObjectByName('zligislandlvl0_seabed001')!
seabedPlane.castShadow = false
seabedPlane.receiveShadow = true

addToGroup(scene.value, islandScene)

onBeforeRender(({ delta, scene }) => {
  uniforms.value.time.value += delta

  const lakePlane1 = islandScene.getObjectByName('zligwaterfalllvl0001') as Mesh
  if (lakePlane1 && lakePlane1.material.userData.shader) {
    lakePlane1.material.userData.shader.uniforms.time = uniforms.value.time
  }

  const lakePlane2 = islandScene.getObjectByName('zligwaterfalllvl1001') as Mesh
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
