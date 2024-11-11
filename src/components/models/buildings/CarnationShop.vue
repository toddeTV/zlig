<script setup lang="ts">
import modelLoader from '@/assets/models/_Buildings/CarnationShop/CarnationShop.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
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

const { scenes: { CarnationShop } } = await modelLoader

const groupWrapperRef = shallowRef<Group>()

const building = CarnationShop.Scene.clone()
building.position.copy(props.position)
building.rotation.copy(props.rotation)

watch(groupWrapperRef, (newValue) => {
  if (!newValue) {
    return
  }
  addShadowAndAddToGroup(newValue, building)
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
