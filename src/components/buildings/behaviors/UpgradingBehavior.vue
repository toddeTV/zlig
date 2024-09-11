<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import useGameState from '@/composables/useGameState.js'
import type { BuildingLotId, BuildingStateUpgrading, BuildingType } from '@/game-logic/buildings/types.js'
import { ResourceRecord } from '@/game-logic/resources.js'

const props = defineProps<{
  lotId: BuildingLotId
  buildingType: BuildingType
  state: BuildingStateUpgrading
}>()

const gameState = useGameState()
const { onBeforeRender } = useLoop()

onBeforeRender((event) => {
  const { delta } = event

  const secondsRemaining = props.state.secondsRemaining.minus(delta)

  if (secondsRemaining.gt(0)) {
    gameState.buildings[props.lotId] = {
      level: props.state.level,
      secondsRemaining,
      state: 'upgrading',
      type: props.buildingType,
    }
  }
  else {
    gameState.buildings[props.lotId] = {
      internalBuffer: new ResourceRecord(),
      level: props.state.level + 1,
      state: 'producing',
      type: props.buildingType,
    }
  }
})
</script>
