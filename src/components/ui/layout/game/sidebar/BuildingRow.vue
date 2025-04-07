<script setup lang="ts">
import Resources from '@/components/ui/Resources.vue'
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { ResourceRecord, ResourcesPerMillisecond } from '@/game-logic/resources.js'
import Big from 'big.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { BuildingAreaId, BuildingType } from '@/game-logic/types.js'

const props = defineProps<{
  buildingType: BuildingType
  buildingAreaId: BuildingAreaId
}>()

const { buildings, resources } = storeToRefs(useGameStateStore())

// TODO: Put this into the game state.
// TODO: Make this individual per building type.
const buildModifiers = {
  costs: new ResourceRecord({ gold: new Big('1') }),
  duration: 1,
}
const incomeModifier = new ResourceRecord({ gold: new Big('1') })

const costs = computed(() => {
  const base = props.buildingType.levelProgression.getBaseCostsForLevel(1)

  return base.times(buildModifiers.costs).round()
})

const buildingDuration = computed(() => {
  const base = props.buildingType.levelProgression.getBaseBuildingDurationForLevel(1)

  return base.times(buildModifiers.duration)
})

const income = computed(() => {
  const base = props.buildingType.levelProgression.getBaseIncomeForLevel(1)

  return new ResourcesPerMillisecond(base.times(incomeModifier))
})

const existingInstancesCount = computed(() => Object.values(buildings.value).filter(building => building?.type.id === props.buildingType.id).length)

const canBuild = computed(() => {
  if (typeof props.buildingType.maxInstances === 'number' && existingInstancesCount.value >= props.buildingType.maxInstances) {
    return 'max-instances'
  }

  if (!resources.value.gte(costs.value)) {
    return 'no-resources'
  }

  return true
})

function build() {
  buildings.value[props.buildingAreaId] = {
    durationRemaining: buildingDuration.value,
    initialDuration: buildingDuration.value,
    level: 0,
    state: 'in-construction',
    type: props.buildingType,
  }

  resources.value = resources.value.minus(costs.value)
}
</script>

<template>
  <button
    class="flex border border-gray-300 rounded-sm bg-gray-100 h-full aspect-square"
    @click="build"
  >
    <img
      :alt="`Preview image of ${props.buildingType.name}`"
      class="scale-250"
      :src="props.buildingType.previewImgSrc"
    >
  </button>
</template>

<style scoped>
</style>
