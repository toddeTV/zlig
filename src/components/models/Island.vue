<script setup lang="ts">
import { BoxGeometry, Mesh, MeshBasicMaterial, type Vector3 } from 'three'
import modelLoader from '@/assets/models/Island/Island.gltf'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

const { scenes } = await modelLoader

const scene = scenes.Scene

Object.entries(scene.Object).forEach(([key, value]) => {
  if (key.startsWith('buildArea')) {
    registeredForSelectingModelStore.register(value)
  }
})

const biomeColors: Partial<Record<string, number>> = {
  any: 0xFFFFFF,
  mountain: 0xFF6666,
  shore: 0x7777FF,
}

const buildingLots: Record<string, {
  pos: Vector3
  biome: string
}> = {}

scene.Scene.traverse((obj) => {
  if (obj.userData.is_building_lot) {
    // Let's pray this is really stable. Loading saved games with different names might break otherwise.
    const stableId = obj.name

    buildingLots[stableId] = {
      biome: obj.userData.building_biome ?? 'any',
      pos: obj.position,
    }
  }
})

const bpMeshes = Object.values(buildingLots).map(({ biome, pos }) => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: biomeColors[biome] ?? 0x00FF00 })
  const cube = new Mesh(geometry, material)

  return { cube, pos }
})
</script>

<template>
  <primitive :object="scene.Scene" />

  <primitive
    v-for="{ cube, pos } in bpMeshes"
    :key="pos"
    :object="cube"
    :position="pos"
  />
</template>

<style scoped>
</style>
