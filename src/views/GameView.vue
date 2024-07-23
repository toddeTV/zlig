<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { type DomEvent, type ThreeEvent, TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
import { EffectComposer, Outline } from '@tresjs/post-processing'
import { BlendFunction, KernelSize } from 'postprocessing'
import useClickedModelNodeStore from '@/composables/useClickedModelNodeStore'
import Bridge from '@/components/models/Bridge.vue'
import BambooBehindFence from '@/components/models/BambooBehindFence.vue'

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

const clickedModelNodeStore = useClickedModelNodeStore()

function onNodeClick(
  event: ThreeEvent<DomEvent> & Event,
) {
  // the click was on the model and the raycaster hit a node, so we do not send the raycast any further
  event.stopPropagation()

  // store the clicked model node
  clickedModelNodeStore.activeObjects = [event.eventObject]
}
</script>

<template>
  <TresCanvas v-bind="gl">
    <!-- visual helper -->
    <TresAxesHelper />
    <TresGridHelper />

    <!-- camera -->
    <TresPerspectiveCamera :position="[9, 9, 9]" />

    <!-- controls -->
    <OrbitControls />

    <!-- lights -->
    <TresDirectionalLight
      cast-shadow
      :intensity="1.2"
      :position="[0, 2, 4]"
    />
    <TresAmbientLight :intensity="0.3" />

    <!-- objects -->
    <TresGroup>
      <Suspense>
        <Bridge
          :position="[0, 0, 0]"
          @click="(event) => onNodeClick(event)"
        />
      </Suspense>
      <Suspense>
        <BambooBehindFence
          :position="[4, 0, 0]"
          @click="(event) => onNodeClick(event)"
        />
      </Suspense>
      <Suspense>
        <BambooBehindFence
          :position="[4, 0, 2]"
          @click="(event) => onNodeClick(event)"
        />
      </Suspense>
    </TresGroup>

    <!-- effects -->
    <Suspense>
      <EffectComposer :multisampling="8">
        <Outline
          :blend-function="BlendFunction.ALPHA"
          :blur="false"
          :edge-strength="2000"
          hidden-edge-color="#000000"
          :kernel-size="KernelSize.VERY_SMALL"
          :outlined-objects="clickedModelNodeStore.activeObjects"
          :pulse-speed="0"
          visible-edge-color="#000000"
        />
      </EffectComposer>
    </Suspense>
  </TresCanvas>

  <!-- TODO remove when feature branch is ready, this is only for debugging while developing -->
  <div class="absolute bg-red-200 z-10 p-2">
    <pre>{{ clickedModelNodeStore.activeObjects.map(e => e.uuid) }}</pre>
  </div>
</template>

<style scoped>
</style>
