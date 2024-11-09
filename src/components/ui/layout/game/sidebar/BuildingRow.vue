<script setup lang="ts">
import Resources from '@/components/ui/Resources.vue'
import useGameState from '@/composables/useGameState.js'
import { ResourceRecord } from '@/game-logic/resources.js'
import Big from 'big.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { BuildingAreaId, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingType: BuildingType
  buildingAreaId: BuildingAreaId
}>()

const gameState = useGameState()
const { buildings, resources } = storeToRefs(gameState)

// TODO: Put this into the game state.
// TODO: Make this individual per building type.
const modifiers = {
  buildingCosts: new ResourceRecord({ gold: new Big('1') }),
  buildingSeconds: 1,
  income: new ResourceRecord({ gold: new Big('1') }),
}

const costs = computed(() => {
  const base = props.buildingType.levelProgression.getBaseCostsForLevel(1)

  return base.times(modifiers.buildingCosts).round()
})

const buildingSeconds = computed(() => {
  const base = props.buildingType.levelProgression.getBaseBuildingSecondsForLevel(1)

  return base.times(modifiers.buildingSeconds).round(1)
})

const income = computed(() => {
  const base = props.buildingType.levelProgression.getBaseIncomeForLevel(1)

  return base.times(modifiers.income)
})

const existingInstancesCount = computed(() => Object.values(buildings.value).filter(building => building?.type.id === props.buildingType.id).length)

const canBuild = computed(() => {
  if (!resources.value.gte(costs.value)) {
    return 'no-resources'
  }

  if (typeof props.buildingType.maxInstances === 'number' && existingInstancesCount.value >= props.buildingType.maxInstances) {
    return 'max-instances'
  }

  return true
})

function build() {
  gameState.$patch((state) => {
    state.buildings[props.buildingAreaId] = {
      level: 0,
      secondsRemaining: buildingSeconds.value,
      state: 'in-construction',
      type: props.buildingType,
    }

    state.resources = state.resources.minus(costs.value)
  })
}
</script>

<template>
  <button
    class="flex flex-col gap-2 border rounded p-2 bg-black bg-opacity-10 text-left"
    :class="{
      'hover:bg-opacity-30': canBuild === true,
      'cursor-pointer': canBuild === true,
      'cursor-not-allowed': canBuild !== true,
    }"
    :disabled="canBuild !== true"
    @click="build"
  >
    <p class="font-bold text-lg">
      {{ props.buildingType.name }}
    </p>

    <!-- TODO: Add building type descriptions and display them here. -->

    <div>
      <p class="font-semibold">
        Costs to build:
      </p>
      <div class="flex gap-2 ml-4">
        <Resources :available="resources" :resources="costs" />
      </div>
    </div>

    <p class="font-semibold">
      Seconds to build: <b>{{ buildingSeconds.toNumber().toLocaleString() }}</b>
    </p>

    <div>
      <p class="font-semibold">
        Produces per second:
      </p>
      <div class="flex gap-2 ml-4">
        <Resources :resources="income" />
      </div>
    </div>

    <div v-if="typeof props.buildingType.maxInstances === 'number'">
      <p class="italic" :class="{ 'text-red-500': canBuild === 'max-instances' }">
        You can build
        <b v-if="existingInstancesCount < props.buildingType.maxInstances">{{ props.buildingType.maxInstances - existingInstancesCount }}</b>
        <b v-else>no</b>
        more (max. <b>{{ props.buildingType.maxInstances }}</b>)
      </p>
    </div>
  </button>
</template>
