<script setup lang="ts">
import ToggleVisibilityButton from '@/components/ui/layout/game/debug/ToggleVisibilityButton.vue'
import { useDebugStore } from '@/composables/useDebugStore.js'
import { GAME_TIME_FACTOR_FASTER, useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { useSelectedBuildingAreaStore } from '@/composables/useSelectedBuildingAreaStore.js'
import { storeToRefs } from 'pinia'

const debug = useDebugStore()
const { currentFactor } = storeToRefs(useGameTimeStore())
const { id: selectedBuildAreaId } = storeToRefs(useSelectedBuildingAreaStore())
</script>

<template>
  <UAccordion
    class="border-4 border-red-600 bg-red-100 border-dashed"
    :items="[{
      label: 'Debug Menu',
      icon: 'ph--bug-beetle',
    }]"
  >
    <template #body>
      <div class="flex flex-col gap-y-4 px-6 py-2">
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
              v-model.number="currentFactor"
              class="w-2/3"
              :max="GAME_TIME_FACTOR_FASTER * 2"
              :min="0"
              type="range"
            >
            <b>{{ currentFactor.toLocaleString() }}</b>
          </div>
          <p class="text-sm italic">
            each real time milliseconds progresses the game time by that much milliseconds
          </p>
        </div>
      </div>
    </template>
  </UAccordion>
</template>

<style scoped>
</style>
