<script setup lang="ts">
import { getNode, SeaBedScene } from '@/assets/models/SeaBed/SeaBed.gltf.js'
import { useCalculatedLightsStore } from '@/composables/useCalculatedLightsStore.js'
import { addToGroup, overrideFogShader, removeFogDependence } from '@/utils/threeHelper.js'
import { storeToRefs } from 'pinia'
import { MeshBasicMaterial, MeshStandardMaterial, Vector3, type WebGLProgramParametersWithUniforms } from 'three'
import { shallowRef, watch } from 'vue'

const groupWrapperRef = shallowRef()

const model = await getNode(SeaBedScene.zligislandlvl0_seabed001)
const seabedPlaneMaterial = (() => { // do not create a new material but use the existing one by cloning it
  if (Array.isArray(model.material)) {
    return model.material[0].clone()
  }
  return model.material.clone()
})()
seabedPlaneMaterial.onBeforeCompile = function (shader: WebGLProgramParametersWithUniforms) {
  overrideFogShader(shader, new Vector3(0, 0, 0), 0)
}
model.material = seabedPlaneMaterial

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
