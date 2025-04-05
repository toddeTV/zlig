<script setup lang="ts">
import { BuildingsScene, getNode } from '@/assets/models/Buildings/Buildings.gltf.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import type { BuildingAreaId, BuildingInstance } from '@/game-logic/types.js'
import type { Euler, Group, Vector3 } from 'three'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingInstance: BuildingInstance
  position: Vector3
  rotation: Euler
}>()

const buildingInstance = toRef(props, 'buildingInstance')

const groupWrapperRef = shallowRef<Group>()

const building = (await getNode(BuildingsScene.building_market_yellow003)).clone()
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
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
