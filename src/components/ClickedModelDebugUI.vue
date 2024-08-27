<script setup lang="ts">
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'
import useClickedModelNodeStore from '@/composables/useSelectedModelsStore'

const clickedModelNodeStore = useClickedModelNodeStore()
const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()
</script>

<template>
  <div class="absolute top-0 left-0 z-20 flex flex-col gap-4">
    <div class="bg-red-200 p-2">
      registered:
      <pre>{{ Array.from(registeredForSelectingModelStore.getRegisteredAll).map(e => `ID ${e}`) }}</pre>
    </div>
    <div class="bg-red-200 p-2">
      selected:
      <pre>{{ clickedModelNodeStore.getSelected?.id ?? '-' }}</pre>
    </div>
    <div class="bg-red-200 p-2">
      move selected:<br>
      <button
        class="bg-blue-200 py-1 px-2 rounded-md"
        @click="() => {
          if (clickedModelNodeStore.hasSelected()){
            clickedModelNodeStore.getSelected!.position.x += 0.1
          }
        }"
      >
        move
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
