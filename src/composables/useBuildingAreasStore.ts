import modelLoader from '@/assets/models/Island/Island.gltf'
import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types.js'
import type { Euler, Vector3 } from 'three'

export default defineStore('building-areas', () => {
  const BuildingAreas = ref<{
    id: BuildingAreaId
    position: Vector3
    rotation: Euler
  }[]>([])

  async function init() {
    const { scenes: { Island } } = await modelLoader

    Island.Scene.traverse((obj) => {
      if (obj.userData.isBuildArea && obj.name) {
        BuildingAreas.value.push({
          id: obj.name,
          position: obj.position,
          rotation: obj.rotation,
        })
      }
    })
  }

  return {
    areas: readonly(BuildingAreas),
    init,
  }
})
