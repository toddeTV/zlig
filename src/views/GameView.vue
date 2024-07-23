<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { type DomEvent, type ThreeEvent, TresCanvas, useTresContext, useTresContextProvider } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import { EffectComposer, Outline } from '@tresjs/post-processing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { computed } from 'vue'
import useClickedModelNodeStore from '@/composables/useClickedModelNodeStore'
import Bridge from '@/components/models/Bridge.vue'
import BambooBehindFence from '@/components/models/BambooBehindFence.vue'
import Untitled from '@/components/models/Untitled.vue'
import Game from '@/components/Game.vue'

const clickedModelNodeStore = useClickedModelNodeStore()

const gl: TresCanvasProps = {
  alpha: false,
  clearColor: '#82DBC5',
  outputColorSpace: SRGBColorSpace,
  renderMode: 'always',
  shadowMapType: BasicShadowMap, // TODO use another shadow type?
  shadows: true,
  toneMapping: NoToneMapping,
  useLegacyLights: false, // TODO use or not?
}
</script>

<template>
  <TresCanvas v-bind="gl">
    <Game />
  </TresCanvas>

  <!-- TODO remove when feature branch is ready, this is only for debugging while developing -->
  <div class="absolute bg-red-200 z-10 p-2">
    <pre>{{ clickedModelNodeStore.activeIds }}</pre>
  </div>
</template>

<style scoped>
</style>
