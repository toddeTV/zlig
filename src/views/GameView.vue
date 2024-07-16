<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { type DomEvent, type ThreeEvent, TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import type { TresCanvasProps } from '@tresjs/core/dist/src/components/TresCanvas.vue.js'
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
  event: ThreeEvent<DomEvent>&Event,
) {
  // the click was on the model and the raycaster hit a node, so we do not send the raycast any further
  event.stopPropagation()

  // This is all present and should not throw type errors:
  console.dir(event.ALT_MASK)
  console.dir(event.clientX)
  console.dir(event.delta)
  console.dir(event.faceIndex)
  console.dir(event.eventObject.uuid)

  // store the clicked model node's uuid
  clickedModelNodeStore.activeUuid = event.eventObject.uuid
}
</script>

<template>
  <TresCanvas v-bind="gl">
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
    </TresGroup>
  </TresCanvas>

  <!-- TODO remove when feature branch is ready, this is only for debugging while developing -->
  <div class="absolute bg-red-200 z-10 p-2">
    {{ clickedModelNodeStore.activeUuid ?? '[none]' }}
  </div>
</template>

<style scoped>
</style>
