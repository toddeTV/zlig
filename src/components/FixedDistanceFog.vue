<script setup lang="ts">
import { useCalculatedLightsStore } from '@/composables/useCalculatedLightsStore.js'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Mesh, MeshBasicMaterial, TorusGeometry } from 'three'
import { watch, watchEffect } from 'vue'

// TODO Fixed fog missing completely. The Torus here should have a Ray Marching depth gradient shader applied to it, so
// that it has a gradient from 1000% transparency to 0% transparency with a inner solid gradient to mimic a fog effect.

const { scene } = useTresContext()
const { showFog } = storeToRefs(useDebugStore())
const { lightColors } = storeToRefs(useCalculatedLightsStore())

const width = 150
const thickness = 20
const torusGeometry = new TorusGeometry(width - thickness, thickness, 10, 100)
const torusMaterial = new MeshBasicMaterial({ color: 0x3498DB })
const torus = new Mesh(torusGeometry, torusMaterial)
torus.rotation.x = Math.PI / 2

watchEffect(() => {
  torusMaterial.color = lightColors.value.sky
})

watch(showFog, (newValue) => {
  scene.value.remove(torus)
  if (newValue === true)
    scene.value.add(torus)
}, {
  immediate: true,
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
