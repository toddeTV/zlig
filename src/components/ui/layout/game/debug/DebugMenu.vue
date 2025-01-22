<script setup lang="ts">
import ToggleVisibilityButton from '@/components/ui/layout/game/debug/ToggleVisibilityButton.vue'
import useDebugStore from '@/composables/useDebugStore.js'
import useGameTime, { GAME_TIME_FACTOR_FASTER } from '@/composables/useGameTimeStore.js'

const debug = useDebugStore()
const gameTime = useGameTime()
</script>

<template>
  <div class="border-4 border-red-600 text-red-950 bg-red-100 p-2 border-dashed">
    <h3 class="text-lg font-bold mb-2">
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

    <div class="mt-4 flex gap-2 items-center">
      <label>
        Current game time factor:

        <input
          v-model.number="gameTime.currentFactor"
          :max="GAME_TIME_FACTOR_FASTER * 3"
          :min="0"
          type="range"
        >
      </label>

      <b>{{ gameTime.currentFactor.toLocaleString() }}</b>
    </div>
    <p class="text-sm italic">
      each real time milliseconds progresses the game time by that much milliseconds
    </p>
  </div>
</template>

<style scoped>
</style>
