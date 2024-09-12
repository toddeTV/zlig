import modelLoader from '@/assets/models/Island/Island.gltf'
import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import type { BuildingLotId } from '@/game-logic/buildings/types.js'
import type { Vector3 } from 'three'

export default defineStore('buildingLots', () => {
  const buildingLots = ref<{ id: BuildingLotId, position: Vector3 }[]>([])

  return {
    async init() {
      const { scenes: { Scene } } = await modelLoader

      Scene.Scene.traverse((obj) => {
        if (obj.userData.is_building_lot && obj.name) {
          buildingLots.value.push({ id: obj.name, position: obj.position })
        }
      })
    },
    lots: readonly(buildingLots),
  }
})
