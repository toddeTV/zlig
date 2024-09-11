<script setup lang="ts">
import BasePopupWrapper from './BasePopupWrapper.vue'
import Resources from '@/components/ui/Resources.vue'
import useGameState from '@/composables/useGameState.js'
import { buildingTypes } from '@/game-logic/buildings/index.js'
import type { BuildingLotId, BuildingType } from '@/game-logic/buildings/types.js'

const props = defineProps<{ lotId: BuildingLotId }>()

const gameState = useGameState()

function getCosts(type: BuildingType) {
  // TODO: Factor in modifiers.
  const costs = type.levelProgression.getBaseCostsForLevel(1)

  return costs
}

function getBuildingSeconds(type: BuildingType) {
  // TODO: Factor in modifiers.
  const seconds = type.levelProgression.getBaseBuildingSecondsForLevel(1)

  return seconds
}

function getIncome(type: BuildingType) {
  // TODO: Factor in modifiers.
  const income = type.levelProgression.getBaseIncomeForLevel(1)

  return income
}

function canBuild(type: BuildingType): true | 'max-instances' | 'no-resources' {
  if (!gameState.resources.hasAvailable(getCosts(type))) {
    return 'no-resources'
  }

  const instancesExisting = Object.values(gameState.buildings).filter(b => b?.type.id === type.id).length
  if (type.maxInstances !== undefined && instancesExisting >= type.maxInstances) {
    return 'max-instances'
  }

  return true
}

function build(type: BuildingType) {
  if (canBuild(type) !== true) {
    // TODO: Display warning here? Actually, this is only a safety measure here as the click should not be possible.
    return
  }

  gameState.resources.remove(getCosts(type).round())

  gameState.buildings[props.lotId] = {
    level: 0,
    secondsRemaining: getBuildingSeconds(type),
    state: 'in-construction',
    type,
  }
}

// TODO: Do not restrict this.
const availableBuildings = [buildingTypes.a, buildingTypes.b]
</script>

<template>
  <BasePopupWrapper title="Empty building lot">
    <div class="flex flex-wrap gap-4">
      <div v-for="type of availableBuildings" :key="type.name" class="border rounded p-2 flex flex-col gap-2">
        <p class="font-bold">
          {{ type.name }}
        </p>

        <div class="flex flex-col gap-1 ml-4">
          <p class="font-semibold text-sm -ml-4">
            Costs
          </p>
          <Resources :resources="getCosts(type)" round />
          <p>Takes {{ getBuildingSeconds(type).round(1).toNumber().toLocaleString() }} seconds to build</p>
        </div>

        <div class="flex flex-col gap-1 ml-4">
          <p class="font-semibold text-sm -ml-4">
            Gives per second
          </p>
          <Resources :resources="getIncome(type)" :round="false" />
        </div>

        <p>
          <button v-if="canBuild(type) === true" class="border p-1 rounded" @click="() => build(type)">
            build
          </button>

          <span v-else class="border p-1 rounded bg-gray-200 text-red-400 cursor-not-allowed">
            <template v-if="canBuild(type) === 'max-instances'">max number reached</template>
            <template v-else-if="canBuild(type) === 'no-resources'">not enough resources</template>
          </span>
        </p>
      </div>
    </div>
  </BasePopupWrapper>
</template>
