<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import { computed } from 'vue'
import type { BuildingAreaId, BuildingStateInConstruction, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingType: BuildingType
  buildingState: BuildingStateInConstruction
}>()

const secondsRemaining = computed(() => {
  const seconds = props.buildingState.secondsRemaining
  const decimals = seconds.lt(1) ? 1 : 0
  return seconds.round(decimals).toNumber()
})

const gameState = useGameState()

function cancelBuild() {
  // TODO: Determine the refunds.

  gameState.$patch((state) => {
    state.buildings[props.buildingAreaId] = undefined
  })
}
</script>

<template>
  <h3 class="font-semibold mb-4">
    <span class="text-xl">{{ props.buildingType.name }}</span>
  </h3>
  <p>
    This building is currently under construction.
    Finished in: <b>{{ secondsRemaining.toLocaleString() }}</b> second{{ secondsRemaining === 1 ? '' : 's' }}
  </p>
  <div class="flex flex-col mt-2 mb-4">
    <ProgressBar
      :max="props.buildingState.initialSeconds.toNumber()"
      :min="0"
      :value="props.buildingState.secondsRemaining.toNumber()"
    />
  </div>

  <button class="border p-1 rounded" @click="cancelBuild">
    cancel build
  </button>
</template>
