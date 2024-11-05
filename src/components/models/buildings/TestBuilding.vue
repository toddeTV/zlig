<script setup lang="ts">
import modelLoader from '@/assets/models/buildings/TestBuilding/TestBuilding.gltf'
import useThreeHelper from '@/composables/useThreeHelper'
import { useTresContext } from '@tresjs/core'
import { watch } from 'vue'
import type { BuildingInstance } from '@/game-logic/types.js'
import type { Vector3 } from 'three'

const props = defineProps<{
  buildingInstance: BuildingInstance
  position: Vector3
  buildingLotId: number
}>()

const { scene } = useTresContext()
const { addShadowAndAddToGroup } = useThreeHelper()

const { scenes: { TestBuilding } } = await modelLoader

const sceneGroup = scene.value.getObjectByName(`building-lot-${props.buildingLotId}`) ?? scene.value

const building = TestBuilding.Scene.clone()
building.position.copy(props.position)

addShadowAndAddToGroup(sceneGroup, building)

watch(() => props.buildingInstance.level, (newValue, _oldValue) => {
  // scale size infinitely linearly
  building.scale.setScalar(2 * newValue)
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>
