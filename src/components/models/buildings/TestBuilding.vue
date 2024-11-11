<script setup lang="ts">
import modelLoader from '@/assets/models/buildings/TestBuilding/TestBuilding.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { onMounted, shallowRef, watch } from 'vue'
import type { BuildingAreaId, BuildingInstance } from '@/game-logic/types.js'
import type { Euler, Vector3 } from 'three'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingInstance: BuildingInstance
  position: Vector3
  rotation: Euler
}>()

const { scenes: { TestBuilding } } = await modelLoader

const groupWrapperRef = shallowRef() // TODO type on `TresGroup` component

const building = TestBuilding.Scene.clone()
building.position.copy(props.position)
building.rotation.copy(props.rotation)

onMounted(() => {
  addShadowAndAddToGroup(groupWrapperRef.value, building)
})

watch(() => props.buildingInstance.level, (newValue, _oldValue) => {
  // scale size infinitely linearly
  building.scale.setScalar(2 * newValue)
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
