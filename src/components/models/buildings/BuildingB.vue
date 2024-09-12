<script setup lang="ts">
import modelLoader from '@/assets/models/buildings/b.gltf'
import useThreeHelper from '@/composables/useThreeHelper'
import { useTresContext } from '@tresjs/core'
import { computed, watch } from 'vue'
import type { BuildingInstance } from '@/game-logic/buildings/types.js'
import type { Object3D, Object3DEventMap, Vector3 } from 'three'

const props = defineProps<{
  buildingInstance: BuildingInstance
  position: Vector3
}>()

const { scene } = useTresContext()
const { addShadowAndAddToGroup } = useThreeHelper()

const { scenes: { Scene } } = await modelLoader

const sceneGroup = scene.value.getObjectByName('sceneGroup') ?? scene.value

const building = Scene.Scene.clone()
building.position.copy(props.position)

addShadowAndAddToGroup(sceneGroup, building)

watch(() => props.buildingInstance.level, (newValue, _oldValue) => {
  // Building B has limited levels so just scale it linearly.
  building.scale.setScalar(2 * newValue)
})
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>
