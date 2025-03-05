<script setup lang="ts">
import { getNode, WindmillScene } from '@/assets/models/_Buildings/Windmill/Windmill.gltf.js'
import { useGameTimeStore } from '@/composables/useGameTimeStore.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { shallowRef, toRef, watch } from 'vue'
import type { BuildingAreaId, BuildingInstance } from '@/game-logic/types.js'
import type { Euler, Group, Vector3 } from 'three'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingInstance: BuildingInstance
  position: Vector3
  rotation: Euler
}>()

const buildingInstance = toRef(props, 'buildingInstance')

const { onTick } = useGameTimeStore()

const groupWrapperRef = shallowRef<Group>()

const building = (await getNode(WindmillScene)).clone()
building.position.copy(props.position)
building.rotation.copy(props.rotation)

const { stop } = watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addShadowAndAddToGroup(newValue, building)
  stop()
})

watch(buildingInstance, (newValue) => {
  // scale size infinitely linearly
  building.scale.setScalar(1 + 0.1 * newValue.level)
})

// animate the windmill
onTick(({ ambientAnimationDelta }) => {
  const turbine = groupWrapperRef.value?.getObjectByName('ea3windmillwindTurbine001')
  if (turbine) {
    turbine.rotateX(ambientAnimationDelta * 2)
  }
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
