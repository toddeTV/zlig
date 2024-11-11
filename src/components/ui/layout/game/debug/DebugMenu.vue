<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import ToggleVisibilityButton from './ToggleVisibilityButton.vue'

const debug = useDebugStore()
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

    <!-- TODO: Add time controls here. -->
  </div>
</template>
