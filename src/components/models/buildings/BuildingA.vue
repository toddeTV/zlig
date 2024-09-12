<script setup lang="ts">
import modelLoader from '@/assets/models/buildings/a.gltf'
import useThreeHelper from '@/composables/useThreeHelper'
import { useTresContext } from '@tresjs/core'
import { watch } from 'vue'
import type { BuildingInstance } from '@/game-logic/buildings/types.js'
import type { Vector3 } from 'three'

const props = defineProps<{
  buildingInstance: BuildingInstance
  position: Vector3
  buildingLotId: number
}>()

const { scene } = useTresContext()
const { addShadowAndAddToGroup } = useThreeHelper()

const { scenes: { Scene } } = await modelLoader

const sceneGroup = scene.value.getObjectByName(`building-lot-${props.buildingLotId}`) ?? scene.value

const building = Scene.Scene.clone()
building.position.copy(props.position)

addShadowAndAddToGroup(sceneGroup, building)

watch(() => props.buildingInstance.level, (newValue, _oldValue) => {
  // Building A has no level limit but we cannot simply scale it forever. Clamp the scale between 1.75 and 5 (for
  // level 100).

  const min = 1.75
  const max = 5

  const minLevel = 0
  const maxLevel = 100
  const levelProgress = Math.min(maxLevel, newValue) / (maxLevel - minLevel)

  building.scale.setScalar(min + (max - min) * levelProgress)
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>
