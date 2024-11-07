import modelLoader from '@/assets/models/Island/Island.gltf'
import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import type { BuildingAreaId } from '@/game-logic/types.js'
import type { Vector3 } from 'three'

export default defineStore('BuildingAreas', () => {
  const BuildingAreas = ref<{ id: BuildingAreaId, position: Vector3 }[]>([])

  return {
    areas: readonly(BuildingAreas),
    async init() {
      const { scenes: { Island } } = await modelLoader

      Island.Scene.traverse((obj) => {
        if (obj.userData.is_building_area && obj.name) {
          BuildingAreas.value.push({ id: obj.name, position: obj.position })
        }
      })
    },
  }
})