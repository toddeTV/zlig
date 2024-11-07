<script setup lang="ts">
import useGameState from '@/composables/useGameState.js'
import useVirtualTimeStore from '@/composables/useVirtualTimeStore.js'
import Resources from '../../Resources.vue'

const { sidebarToggleId } = defineProps({
  sidebarToggleId: {
    required: true,
    type: String,
  },
})

const gameState = useGameState()
const virtualTime = useVirtualTimeStore()
</script>

<template>
  <div class="bg-gray-300 shadow z-20 flex items-center gap-3 p-3">
    <label class="md:hidden flex items-center text-xl" :for="sidebarToggleId" title="Toggle menu">
      <span class="icon-[ph--list]" />
    </label>

    <div class="flex gap-3 items-baseline text-2xl flex-grow justify-center">
      <Resources :resources="gameState.resources.available" />
    </div>

    <div class="flex flex-col gap-1 items-center">
      <p class="text-lg border rounded-lg px-1 bg-white">
        {{ virtualTime.currentVirtualTime.toLocaleTimeString(undefined, { timeStyle: 'short' }) }}
      </p>

      <div class="flex gap-1 text-xl">
        <!-- TODO: Implement this -->
        <button>
          <span class="icon-[ph--pause-circle-light] hover:icon-[ph--pause-circle-bold]" />
        </button>
        <button>
          <span class="icon-[ph--play-circle-light] hover:icon-[ph--play-circle-bold]" />
        </button>
        <button>
          <span class="icon-[ph--fast-forward-circle-light] hover:icon-[ph--fast-forward-circle-bold]" />
        </button>
      </div>
    </div>
  </div>
</template>
