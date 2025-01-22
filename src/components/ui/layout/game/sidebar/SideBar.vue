<script setup lang="ts">
import DebugMenu from '@/components/ui/layout/game/debug/DebugMenu.vue'
import SelectedBuildingDetails from '@/components/ui/layout/game/sidebar/SelectedBuildingDetails.vue'
import SelectedBuildingInConstruction from '@/components/ui/layout/game/sidebar/SelectedBuildingInConstruction.vue'
import SelectedBuildingUpgrading from '@/components/ui/layout/game/sidebar/SelectedBuildingUpgrading.vue'
import SelectedEmptyBuildingArea from '@/components/ui/layout/game/sidebar/SelectedEmptyBuildingArea.vue'
import useGameState from '@/composables/useGameStateStore.js'
import useSelectedBuildingArea from '@/composables/useSelectedBuildingAreaStore.js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { buildings } = storeToRefs(useGameState())
const selectedBuildingArea = useSelectedBuildingArea()
const selectedBuildingInstance = computed(() => selectedBuildingArea.id ? buildings.value[selectedBuildingArea.id] : undefined)

// TODO bind this so that it is only active for real debug purposes
const hasDebug = ref(true)
</script>

<template>
  <div class="bg-white min-h-0 flex flex-1 flex-col gap-1">
    <div v-if="!selectedBuildingArea.id" class="flex flex-1 flex-col p-3 items-center justify-center">
      <p class="text-gray-400">
        Please select a building or building area...
      </p>
    </div>

    <div v-else class="flex-grow overflow-y-auto p-3">
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
      <SelectedEmptyBuildingArea v-else :building-area-id="selectedBuildingArea.id" />
    </div>

    <hr>

    <DebugMenu v-if="hasDebug" />

    <div class="text-gray-600 text-sm p-2 flex justify-between">
      <a href="https://github.com/toddeTV/zlig/" rel="noopener noreferrer" target="_blank">
        &copy; {{ new Date().getFullYear() }} zlig
      </a>

      <!-- TODO Privacy Policy -->
      <!-- TODO Legal Notice -->
      <!-- TODO version -->
    </div>
  </div>
</template>

<style scoped>
</style>
