<script setup lang="ts">
import useDebugStore from '@/composables/useDebugStore'
import { useTresContext } from '@tresjs/core'
import { storeToRefs } from 'pinia'
import { Fog } from 'three'
import { watch } from 'vue'

const { scene } = useTresContext()
const { isDebugFog } = storeToRefs(useDebugStore())

// TODO set min and max distance correctly regarding the model size after the new model was added
// TODO set the distances correct for zoom/ dolly the camera controller nearer and further from the model
const fog = new Fog(0x82DBC5, 140, 160)

watch(() => isDebugFog.value, (newValue, _oldValue) => {
  updateHelperVisibility(newValue)
})
function updateHelperVisibility(isVisible: boolean) {
  scene.value.fog = fog
  if (isVisible === false)
    scene.value.fog = null
}
updateHelperVisibility(isDebugFog.value)
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
