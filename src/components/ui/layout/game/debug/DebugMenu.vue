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
  <div class="border-4 border-red-600 text-red-950 bg-red-100 p-2 border-dashed flex flex-col gap-y-4 w-full">
    <h3 class="text-lg font-bold">
      Debug menu
    </h3>

    <div class="grid grid-cols-2 gap-1">
      <ToggleVisibilityButton v-model="debug.showVisualHelper">
        visual helper
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showLightHelper">
        lights helper
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showCameraHelper">
        camera helper
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showFog">
        fog
      </ToggleVisibilityButton>
      <ToggleVisibilityButton v-model="debug.showWaterWireframe">
        water wireframe
      </ToggleVisibilityButton>
    </div>

    <div class="flex flex-col">
      <div>
        Selected Build Area:
      </div>
      <div>
        {{ selectedBuildAreaId ?? '<none>' }}
      </div>
    </div>

    <div class="flex flex-col">
      <label for="gameTimeFactor">Current game time factor:</label>
      <div class="flex gap-2 items-center w-max-full">
        <input
          id="gameTimeFactor"
          v-model.number="gameTime.currentFactor"
          class="w-2/3"
          :max="GAME_TIME_FACTOR_FASTER * 2"
          :min="0"
          type="range"
        >
        <b>{{ gameTime.currentFactor.toLocaleString() }}</b>
      </div>
      <p class="text-sm italic">
        each real time milliseconds progresses the game time by that much milliseconds
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
