<script setup lang="ts">
import { BuildAreaScene, getNode } from '@/assets/models/BuildArea/BuildArea.gltf.js'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { shallowRef, watch } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types.js'
import type { Euler, Group, Vector3 } from 'three'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  position: Vector3
  rotation: Euler
}>()

const groupWrapperRef = shallowRef<Group>()

const building = (await getNode(BuildAreaScene.zligbuildAreabase001)).clone()
building.position.copy(props.position)
building.rotation.copy(props.rotation)

const { stop } = watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addShadowAndAddToGroup(newValue, building)
  stop()
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
