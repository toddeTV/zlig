<script setup lang="ts">
import BasePopupWrapper from './BasePopupWrapper.vue'
import Resources from '@/components/ui/Resources.vue'
import useGameState from '@/composables/useGameState.js'
import type { BuildingLotId, BuildingStateProducing, BuildingType } from '@/game-logic/buildings/types.js'

const props = defineProps<{
  lotId: BuildingLotId
  buildingType: BuildingType
  state: BuildingStateProducing
}>()

const gameState = useGameState()

function getIncome() {
  // TODO: Factor in modifiers.
  const income = props.buildingType.levelProgression.getBaseIncomeForLevel(props.state.level)

  return income
}

function destroy() {
  gameState.buildings[props.lotId] = undefined
}
</script>

<template>
  <BasePopupWrapper :title="props.buildingType.name">
    <div class="flex flex-col gap-1 ml-4">
      <p class="font-semibold text-sm -ml-4">
        Produces per second
      </p>
      <Resources :resources="getIncome()" :round="false" />
    </div>

    <p>
      <button class="border p-1 rounded" @click="destroy">
        destroy
      </button>
    </p>
  </BasePopupWrapper>
</template>
