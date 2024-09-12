<script setup lang="ts">
import { useTresContext } from '@tresjs/core'
import { Fog } from 'three'

const { scene } = useTresContext()

// TODO set min and max distance correctly regarding the model size after the new model was added
// TODO set the distances correct for zoom/ dolly the camera controller nearer and further from the model
const fog = new Fog(0x82DBC5, 140, 160)

scene.value.fog = fog
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
