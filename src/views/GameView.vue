<script setup lang="ts">
import GameEngine from '@/components/GameEngine.vue'
import useVirtualTimeStore from '@/composables/useVirtualTimeStore'
import { TresCanvas } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { NoToneMapping, SRGBColorSpace, VSMShadowMap } from 'three'
import { ref, watch } from 'vue'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'

const { getColorByTime, rgbToHex, skyTimeColorTransitionPreset } = useVirtualTimeStore()
const { currentVirtualTime } = storeToRefs(useVirtualTimeStore())

const gl = ref<TresCanvasProps>({
  alpha: false,
  clearColor: '#82DBC5',
  disableRender: true, // Disable render on requestAnimationFrame, useful for PostProcessing // TODO use or not?
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  // `VSMShadowMap` better shadows, but more performance heavy; `BasicShadowMap` is faster but has less quality
  shadowMapType: VSMShadowMap, // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | VSMShadowMap
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false,
})

// watch the current virtual time
watch(() => currentVirtualTime.value, (newValue, _oldValue) => {
  // set the sky color
  gl.value.clearColor = rgbToHex(getColorByTime(newValue, skyTimeColorTransitionPreset))
})
</script>

<!-- @pointer-missed="() => firePointerMissedEvent()" -->
<template>
  <div class="h-full overflow-hidden relative">
    <TresCanvas
      v-bind="gl"
    >
      <GameEngine />
    </TresCanvas>
  </div>
</template>

<style scoped>
</style>
