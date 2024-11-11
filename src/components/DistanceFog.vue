<script setup lang="ts">
import useCalculatedLights from '@/composables/useCalculatedLights.js'
import useDebugStore from '@/composables/useDebugStore'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Fog } from 'three'
import { watch, watchEffect } from 'vue'

const { scene } = useTresContext()
const { showFog } = storeToRefs(useDebugStore())
const { lightColors } = storeToRefs(useCalculatedLights())

const fog = new Fog(0x82DBC5, 140, 160)

// watch the current virtual time
watchEffect(() => {
  // set the sky color
  fog.color = lightColors.value.sky
})

// watch the fog visibility
watch(() => showFog.value, (newValue) => {
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
