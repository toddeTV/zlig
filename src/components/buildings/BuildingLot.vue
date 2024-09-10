<script setup lang="ts">
import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three'
import { computed } from 'vue'
import modelLoader from '@/assets/models/Island/Island.gltf'
import useSelectedBuildingLot from '@/composables/useSelectedBuildingLot.js'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'

const props = defineProps<{
  id: string
  position: Vector3
}>()

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 0x00FF00 })
const cube = new Mesh(geometry, material)

const { scenes: { Scene } } = await modelLoader

const selectedBuildingLot = useSelectedBuildingLot()

function onClick(e: TresJsClickEvent) {
  e.stopPropagation()

  selectedBuildingLot.id = props.id
}

const position = computed(() => selectedBuildingLot.id === props.id ? new Vector3(0, 1, 0).add(props.position) : props.position)
</script>

<template>
  <TresGroup @click="onClick">
    <primitive :object="cube" :position="position" />

    <primitive :object="Scene.Object[props.id as keyof typeof Scene.Object]" />
  </TresGroup>
</template>
