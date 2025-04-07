<script setup lang="ts">
import DebugMenu from '@/components/ui/layout/game/debug/DebugMenu.vue'
import SelectedBuildingDetails from '@/components/ui/layout/game/sidebar/SelectedBuildingDetails.vue'
import SelectedBuildingInConstruction from '@/components/ui/layout/game/sidebar/SelectedBuildingInConstruction.vue'
import SelectedBuildingUpgrading from '@/components/ui/layout/game/sidebar/SelectedBuildingUpgrading.vue'
import SelectedEmptyBuildingArea from '@/components/ui/layout/game/sidebar/SelectedEmptyBuildingArea.vue'
import { useGameStateStore } from '@/composables/useGameStateStore.js'
import { useSelectedBuildingAreaStore } from '@/composables/useSelectedBuildingAreaStore.js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { buildings } = storeToRefs(useGameStateStore())
const selectedBuildingArea = useSelectedBuildingAreaStore()
const selectedBuildingInstance = computed(() => selectedBuildingArea.id ? buildings.value[selectedBuildingArea.id] : undefined)
</script>

<template>
  <div class="flex w-full h-full">
    <div v-if="!selectedBuildingArea.id" class="flex flex-1 flex-col items-center justify-center">
      <p class="text-gray-400">
        Please select a building or building area...
      </p>
    </div>

    <div v-else class="w-full h-full">
      <SelectedBuildingInConstruction
        v-if="selectedBuildingInstance?.state === 'in-construction'"
        :building-area-id="selectedBuildingArea.id"
        :building-state="selectedBuildingInstance"
        :building-type="selectedBuildingInstance.type"
      />
      <SelectedBuildingUpgrading
        v-else-if="selectedBuildingInstance?.state === 'upgrading'"
        :building-area-id="selectedBuildingArea.id"
        :building-state="selectedBuildingInstance"
        :building-type="selectedBuildingInstance.type"
      />
      <SelectedBuildingDetails
        v-else-if="selectedBuildingInstance?.state === 'producing'"
        :building-area-id="selectedBuildingArea.id"
        :building-state="selectedBuildingInstance"
        :building-type="selectedBuildingInstance.type"
      />
      <SelectedEmptyBuildingArea
        v-else
        :building-area-id="selectedBuildingArea.id"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
