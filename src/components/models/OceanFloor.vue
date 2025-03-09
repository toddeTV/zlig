<script setup lang="ts">
import { getNode, OceanFloorScene } from '@/assets/models/OceanFloor/OceanFloor.gltf.js'
import { addToGroup, overrideFogShader } from '@/utils/threeHelper.js'
import { Vector3, type WebGLProgramParametersWithUniforms } from 'three'
import { shallowRef, watch } from 'vue'

const groupWrapperRef = shallowRef()

const model = await getNode(OceanFloorScene.ocean_floor)
const material = (() => { // do not create a new material but use the existing one by cloning it
  if (Array.isArray(model.material)) {
    return model.material[0].clone()
  }
  return model.material.clone()
})()
material.onBeforeCompile = function (shader: WebGLProgramParametersWithUniforms) {
  overrideFogShader(shader, new Vector3(0, 0, 0), 0)
}
model.material = material

const { stop } = watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addToGroup(newValue, model, true)
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
