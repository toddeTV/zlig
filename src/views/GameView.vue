<script setup lang="ts">
import { ref } from 'vue'

// TODO bind this so that it is only active for real debug purposes
const hasDebug = ref(true)
</script>

<template>
  <div class="relative flex flex-col w-dvw min-w-dvw max-w-dvw h-dvh min-h-dvh max-h-dvh overflow-hidden">
    <div class="z-1 absolute flex top-0 place-self-center">
      <TimeDisplayWithControl />
    </div>
    <div class="z-0 relative w-full h-full">
      <GameCanvas />
    </div>
    <div class="z-1 absolute flex flex-row justify-between heightWithBreakpoints bottom-0 w-full bg-white">
      <div class="relative w-full h-full">
        <SelectedBuildingArea />
        <div class="absolute h-[40px] -top-[40px] right-0 bg-white pl-4 pr-2 pt-2 rounded-tl-full">
          <CurrentResources />
        </div>
      </div>
    </div>
    <div class="z-1 absolute top-0 right-0 place-self-center">
      <DebugMenu v-if="hasDebug" />
    </div>
  </div>
</template>

<style scoped>
/* set the height of the bottom bar depending on the user display height (instead of width breakpoints) */
.heightWithBreakpoints {
  @apply [@media_((min-height:0px)_and_(max-height:500px))]:h-[100px];
  @apply [@media_((min-height:500px)_and_(max-height:1000px))]:h-[150px];
  @apply [@media(min-height:1000px)]:h-[200px];
}
</style>
