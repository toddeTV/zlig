<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
// import { EffectComposer, Outline } from '@tresjs/post-processing'
// import { BlendFunction } from 'postprocessing'
// import { computed } from 'vue'
import useClickedModelNodeStore from '@/composables/useSelectedModelsStore'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent'
import Bridge from '@/components/models/Bridge.vue'
import BambooBehindFence from '@/components/models/BambooBehindFence.vue'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

const clickedModelNodeStore = useClickedModelNodeStore()
const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

// const { scene } = useTresContext()

// const activeObjects = computed(() => {
//   const selectedObjects = clickedModelNodeStore.selectedIds.map(id => scene.value.getObjectById(id))
//   const nonUndefinedSelectedObjects = selectedObjects.filter((element) => {
//     return element !== undefined
//   })
//   return nonUndefinedSelectedObjects
// })

function onNodeClick(
  event: TresJsClickEvent,
) {
  // the raycaster hit a node/ model, so we do not send the raycast any further down
  event.stopPropagation()

  // toggle the model selection if the model is registered to be selectable
  if (registeredForSelectingModelStore.isRegistered(event.object)) {
    clickedModelNodeStore.toggle(event.object)
    return
  }

  // unselect all models if the raycaster hits a model that is not registered to be selectable
  clickedModelNodeStore.unselectAll()
}
</script>

<template>
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
  <TresGroup
    @click="(e) => onNodeClick(e)"
  >
    <Suspense>
      <Bridge
        :position="[0, 0, 0]"
      />
    </Suspense>
    <Suspense>
      <Bridge
        :position="[0, 0, -2]"
      />
    </Suspense>
    <Suspense>
      <BambooBehindFence
        :position="[4, 0, 0]"
      />
    </Suspense>
    <Suspense>
      <BambooBehindFence
        :position="[4, 0, 2]"
      />
    </Suspense>
  </TresGroup>

  <!-- effects -->
  <!-- <Suspense>
    <EffectComposer>
      <Outline
        :blend-function="BlendFunction.ALPHA"
        :blur="false"
        :edge-strength="5"
        hidden-edge-color="#32a852"
        :multisampling="8"
        :outlined-objects="activeObjects"
        :pulse-speed="2"
        visible-edge-color="#bd3758"
      />
    </EffectComposer>
  </Suspense> -->
</template>

<style scoped>
</style>
