<script setup lang="ts">
import modelLoader from '@/assets/models/BuildArea/BuildArea.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper.js'
import { shallowRef, watch } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types'
import type { Euler, Group, Vector3 } from 'three'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  position: Vector3
  rotation: Euler
}>()

const { scenes } = await modelLoader

const groupWrapperRef = shallowRef<Group>()

const building = scenes.BuildArea.Object.zligbuildAreabase001.clone()
building.position.copy(props.position)
building.rotation.copy(props.rotation)

watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addShadowAndAddToGroup(newValue, building)
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
