<script setup lang="ts">
import { BoxGeometry, Mesh, MeshBasicMaterial, type Vector3 } from 'three'

const props = defineProps<{
  id: string
  position: Vector3
}>()

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 0x00FF00 })
const cube = new Mesh(geometry, material)
</script>

<template>
  <primitive :object="cube" :position="props.position" />
</template>
