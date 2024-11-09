<script setup lang="ts">
import modelLoader from '@/assets/models/buildings/TestBuilding/TestBuilding.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { useTresContext } from '@tresjs/core'
import { watch } from 'vue'
import type { BuildingAreaId, BuildingInstance } from '@/game-logic/types.js'
import type { Euler, Vector3 } from 'three'

const props = defineProps<{
  buildingInstance: BuildingInstance
  position: Vector3
  rotation: Euler
  buildingAreaId: BuildingAreaId
}>()

const { scene } = useTresContext()

const { scenes: { TestBuilding } } = await modelLoader

const sceneGroup = scene.value.getObjectByName(`building-area-${props.buildingAreaId}`) ?? scene.value

const building = TestBuilding.Scene.clone()
building.position.copy(props.position)
building.rotation.copy(props.rotation)

addShadowAndAddToGroup(sceneGroup, building)

watch(() => props.buildingInstance.level, (newValue, _oldValue) => {
  // scale size infinitely linearly
  building.scale.setScalar(2 * newValue)
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>
