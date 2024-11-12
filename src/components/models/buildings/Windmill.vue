<script setup lang="ts">
import modelLoader from '@/assets/models/_Buildings/Windmill/Windmill.gltf'
import { addShadowAndAddToGroup } from '@/utils/threeHelper'
import { useLoop } from '@tresjs/core'
import { shallowRef, toRef, watch } from 'vue'
import type { BuildingAreaId, BuildingInstance } from '@/game-logic/types.js'
import type { Euler, Group, Vector3 } from 'three'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  buildingInstance?: BuildingInstance
  position: Vector3
  rotation: Euler
  noAnimation?: boolean
}>()

const buildingInstance = toRef(props, 'buildingInstance')

const { onBeforeRender } = useLoop()
const { scenes: { Windmill } } = await modelLoader

const groupWrapperRef = shallowRef<Group>()

const building = Windmill.Scene.clone()
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
  building.scale.setScalar(1)
  if (newValue) {
    building.scale.setScalar(1 + 0.1 * newValue.level)
  }
})

// animate the windmill
// watch(currentTime, (time, prev) => { // relate to in-game time
//   const deltaMs = time.getTime() - prev.getTime()
onBeforeRender(({ elapsed }) => { // relate on renderer
  if (!groupWrapperRef.value || props.noAnimation === true) {
    return
  }
  // TODO do not use string in `getObjectByName` bc string will not throw error on build time
  const windTurbine = groupWrapperRef.value.getObjectByName('ea3windmillwindTurbine001')
  if (!windTurbine) {
    console.error('Windmill: windTurbine not found')
    return
  }
  windTurbine.rotation.x += elapsed * 0.00015
})
</script>

<template>
  <TresGroup
    ref="groupWrapperRef"
  />
</template>

<style scoped>
</style>
