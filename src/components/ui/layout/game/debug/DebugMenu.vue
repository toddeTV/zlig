<script setup lang="ts">
import ToggleVisibilityButton from '@/components/ui/layout/game/debug/ToggleVisibilityButton.vue'
import useDebugStore from '@/composables/useDebugStore'
import useGameTime, { GAME_TIME_FACTOR_FASTER } from '@/composables/useGameTime.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingArea.js'
import { storeToRefs } from 'pinia'

const debug = useDebugStore()
const gameTime = useGameTime()
const { id: selectedBuildAreaId } = storeToRefs(useSelectedBuildingArea())
</script>

<template>
  <div class="border-4 border-red-600 text-red-950 bg-red-100 p-2 border-dashed flex flex-col gap-y-1 w-full">
    <h3 class="text-lg font-bold">
      Debug menu
    </h3>

    <div class="grid grid-cols-4 gap-1 text-xs">
      <ToggleVisibilityButton v-model="debug.showVisualHelper">
        visuals
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showLightHelper">
        lights
      </ToggleVisibilityButton>
      <!-- <ToggleVisibilityButton v-model="debug.showCameraHelper">
        camera
      </ToggleVisibilityButton> -->
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
