<script setup lang="ts">
import { BoxGeometry, Mesh, MeshBasicMaterial, type Vector3 } from 'three'
import modelLoader from '@/assets/models/Island/Island.gltf'

const props = defineProps<{
  id: string
  position: Vector3
}>()

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 0x00FF00 })
const cube = new Mesh(geometry, material)

const { scenes: { Scene } } = await modelLoader
</script>

<template>
  <TresGroup @click="(e) => console.log(e)">
    <primitive :object="cube" :position="props.position" />

    <primitive :object="Scene.Object[props.id as keyof typeof Scene.Object]" />
  </TresGroup>
</template>
