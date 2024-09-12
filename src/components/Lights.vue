<script setup lang="ts">
import { AmbientLight, DirectionalLight } from 'three'
import { useTresContext } from '@tresjs/core'

const { scene } = useTresContext()

const ambientLight = new AmbientLight(0xFFFFFF, 0.6)
scene.value.add(ambientLight)

const directionalLight = new DirectionalLight(0xFFFFFF, 1.5)
directionalLight.castShadow = true
directionalLight.position.set(-10, 20, 20)

directionalLight.shadow.mapSize.width = 1024 * 2 // more beautiful, but performance heavier
directionalLight.shadow.mapSize.height = 1024 * 2

directionalLight.shadow.bias = -0.01 // fine tune to reduce shadow artifacts (negative and as close to 0 as possible)

directionalLight.shadow.camera.near = 10
directionalLight.shadow.camera.far = 60
directionalLight.shadow.camera.left = -35
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.top = 25
directionalLight.shadow.camera.bottom = -15

// directionalLight.shadow.camera.updateProjectionMatrix()
// // directionalLight.shadow.needsUpdate = true
// directionalLight.shadow.updateMatrices(directionalLight)

scene.value.add(directionalLight)

// const helper = new CameraHelper(directionalLight.shadow.camera)
// scene.value.add(helper)
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
</template>

<style scoped>
</style>
