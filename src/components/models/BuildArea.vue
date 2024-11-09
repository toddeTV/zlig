<script setup lang="ts">
import modelLoader from '@/assets/models/BuildArea/BuildArea.gltf'
import { type TresInstance, type TresPrimitive, useTresContext } from '@tresjs/core'
import { Color, type Euler, Group, type Intersection, Mesh, type Object3D, type Vector3 } from 'three'
import { onMounted, ref, shallowRef } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types'

const props = defineProps<{
  buildingAreaId: BuildingAreaId
  position: Vector3
  rotation: Euler
}>()

const obj = shallowRef<TresPrimitive>()
const modelObject = ref(new Group())

const { scenes } = await modelLoader

onMounted(() => {
  if (!obj.value) {
    return
  }

  // const model = scenes.BuildArea.Object.zligbuildAreabase001.clone()
  const model = scenes.BuildArea.Scene.clone()
  model.position.copy(props.position)
  model.rotation.copy(props.rotation)
  modelObject.value = model
})
</script>

<template>
  <primitive
    ref="obj"
    :object="modelObject"
  />
</template>

<style scoped>
</style>
