<script setup lang="ts">
import modelLoader from '@/assets/models/BuildArea/BuildArea.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { Html } from '@tresjs/cientos'
import { useTresContext } from '@tresjs/core'
import { onMounted, shallowRef } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types'
import type { Euler, Vector3 } from 'three'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  position: Vector3
  rotation: Euler
}>()

const { scenes } = await modelLoader

const groupWrapperRef = shallowRef() // TODO type on `TresGroup` component

const building = scenes.BuildArea.Object.zligbuildAreabase001.clone()
building.position.copy(props.position)
building.rotation.copy(props.rotation)

onMounted(() => {
  addShadowAndAddToGroup(groupWrapperRef.value, building)
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>
