<script setup lang="ts">
import { Box, Html } from '@tresjs/cientos'
import { Vector3 } from 'three'
import { computed } from 'vue'
import modelLoader from '@/assets/models/Island/Island.gltf'
import useSelectedBuildingLot from '@/composables/useSelectedBuildingLot.js'
import type { TresJsClickEvent } from '@/types/TresJsClickEvent.js'

const props = defineProps<{
  id: string
  position: Vector3
}>()

const { scenes: { Scene } } = await modelLoader

const selectedBuildingLot = useSelectedBuildingLot()

const isSelected = computed(() => selectedBuildingLot.id === props.id)

function onClick(e: TresJsClickEvent) {
  e.stopPropagation()

  selectedBuildingLot.id = props.id
}

const offset = computed(() => new Vector3(0, isSelected.value ? 1 : 0.5, 0))
</script>

<template>
  <TresGroup @click="onClick">
    <Box :args="[1, 1, 1]" :position="new Vector3(0, 0, 0).add(props.position).add(offset)">
      <TresMeshBasicMaterial color="lightgreen" />
    </Box>

    <Html
      v-if="isSelected"
      center
      :position="new Vector3(0, 3, 0).add(props.position).add(offset)"
    >
      <h1 class="bg-white dark:bg-dark p-1 rounded w-[100px]" @click="console.log">
        I'm a Box 📦
      </h1>
    </Html>

    <primitive :object="Scene.Object[props.id as keyof typeof Scene.Object]" />
  </TresGroup>
</template>
