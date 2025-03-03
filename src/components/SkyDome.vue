<script setup lang="ts">
import { useCalculatedLightsStore } from '@/composables/useCalculatedLightsStore.js'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { BackSide, Mesh, MeshBasicMaterial, SphereGeometry } from 'three'
import { watchEffect } from 'vue'

const { scene } = useTresContext()
const { lightColors } = storeToRefs(useCalculatedLightsStore())

const sky = new Mesh(
  new SphereGeometry(150, 32, 32),
  new MeshBasicMaterial({
    color: lightColors.value.sky,
    side: BackSide,
  }),
)

scene.value.add(sky)

watchEffect(() => {
  sky.material.color = lightColors.value.sky
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
