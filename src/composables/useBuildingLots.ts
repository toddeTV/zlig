import { defineStore } from 'pinia'
import type { Vector3 } from 'three'
import { readonly, ref } from 'vue'
import modelLoader from '@/assets/models/Island/Island.gltf'

export default defineStore('buildingLots', () => {
  const buildingLots = ref<{ id: string, position: Vector3 }[]>([])

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
