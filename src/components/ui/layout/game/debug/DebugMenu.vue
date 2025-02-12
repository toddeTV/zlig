<script setup lang="ts">
import ToggleVisibilityButton from '@/components/ui/layout/game/debug/ToggleVisibilityButton.vue'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { useSelectedBuildingAreaStore } from '@/composables/useSelectedBuildingAreaStore.js'
import { storeToRefs } from 'pinia'

const debug = useDebugStore()
const { id: selectedBuildAreaId } = storeToRefs(useSelectedBuildingAreaStore())
</script>

<template>
  <div class="border-4 border-red-600 text-red-950 bg-red-100 p-2 border-dashed flex flex-col gap-y-1 w-full">
    <h3 class="text-lg font-bold">
      Debug menu
    </h3>

    <div class="grid grid-cols-5 gap-1 text-[0.6em]">
      <ToggleVisibilityButton v-model="debug.showVisualHelper">
        visuals
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showLightHelper">
        lights
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showCameraHelper">
        camera
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showFog">
        fog
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showWaterWireframe">
        water
      </ToggleVisibilityButton>
    </div>

    <div class="flex flex-row gap-2 text-sm">
      <div>
        Area:
      </div>
      <div>
        {{ selectedBuildAreaId ?? '<none>' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
