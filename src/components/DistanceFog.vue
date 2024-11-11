<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import useSunPosition from '@/composables/useSunPosition.js'
import useVirtualTimeStore from '@/composables/useVirtualTimeStore'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Fog } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { showFog } = storeToRefs(useDebugStore())
const { calculateLightBySunPosition } = useVirtualTimeStore()
const { sunPosition } = storeToRefs(useSunPosition())

const fog = new Fog(0x82DBC5, 140, 160)

// watch the current virtual time
watch(sunPosition, (position) => {
  // set the sky color
  const { skyColor } = calculateLightBySunPosition(position)
  fog.color = skyColor
})

// watch the fog visibility
watch(() => showFog.value, (newValue, _oldValue) => {
  updateHelperVisibility(newValue)
})
function updateHelperVisibility(isVisible: boolean) {
  scene.value.fog = fog
  if (isVisible === false)
    scene.value.fog = null
}
updateHelperVisibility(showFog.value)
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
