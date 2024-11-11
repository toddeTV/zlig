<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'
import useGameState from '@/composables/useGameState.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import { computed } from 'vue'
import type { BuildingAreaId, BuildingStateUpgrading, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingType: BuildingType
  buildingState: BuildingStateUpgrading
}>()

const secondsRemaining = computed(() => {
  const seconds = props.buildingState.secondsRemaining
  const decimals = seconds.lt(1) ? 1 : 0
  return seconds.round(decimals).toNumber()
})

const gameState = useGameState()

function cancelUpgrade() {
  // TODO: Determine the refunds.

  gameState.$patch((state) => {
    state.buildings[props.buildingAreaId] = {
      internalBuffer: new ResourceRecord(),
      level: props.buildingState.level,
      state: 'producing',
      type: props.buildingType,
    }
  })
}
</script>

<template>
  <h3 class="font-semibold mb-4">
    <span class="text-xl">{{ props.buildingType.name }}</span>
    <span> (Level {{ props.buildingState.level }})</span>
  </h3>
  <p>
    This building is currently being upgraded to level <b>{{ props.buildingState.level + 1 }}</b>.
    Finished in: <b>{{ secondsRemaining.toLocaleString() }}</b> second{{ secondsRemaining === 1 ? '' : 's' }}
  </p>
  <div class="flex flex-col mt-2 mb-4">
    <ProgressBar
      :max="props.buildingState.initialSeconds.toNumber()"
      :min="0"
      :value="props.buildingState.secondsRemaining.toNumber()"
    />
  </div>

  <button class="border p-1 rounded" @click="cancelUpgrade">
    cancel upgrading
  </button>
</template>
