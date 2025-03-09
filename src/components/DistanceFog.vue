<script setup lang="ts">
import { useCalculatedLightsStore } from '@/composables/useCalculatedLightsStore.js'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Fog } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { showFog } = storeToRefs(useDebugStore())
const { lightColors } = storeToRefs(useCalculatedLightsStore())

const fog = new Fog(lightColors.value.sky, 110, 150)

watch(() => lightColors.value.sky, (newValue) => {
  fog.color = newValue
})

watch(showFog, (newValue) => {
  scene.value.fog = fog
  if (newValue === false)
    scene.value.fog = null
}, {
  immediate: true,
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
