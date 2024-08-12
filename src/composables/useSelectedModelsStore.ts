import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { reactive } from 'vue'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

export default defineStore('selectedModelsStore', () => {
  const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

  const selected = reactive(new Set<Object3D>())

  function getSelected(id: number): Object3D | undefined {
    return Array.from(selected).find(obj => obj.id === id)
  }

  function getSelectedAll(): Object3D[] {
    return Array.from(selected)
  }

  function isSelected(obj: Object3D): boolean {
    return selected.has(obj)
  }

  function select(obj: Object3D): boolean {
    if (isSelected(obj)) {
      return false
    }
    if (!registeredForSelectingModelStore.isRegistered(obj)) {
      return false
    }
    selected.add(obj)
    return true
  }

  function unselect(obj: Object3D): boolean {
    if (!isSelected(obj)) {
      return false
    }
    selected.delete(obj)
    return true
  }

  function unselectAll(): boolean {
    selected.clear()
    return true
  }

  function toggle(obj: Object3D): boolean {
    if (isSelected(obj)) {
      return unselect(obj)
    }
    return select(obj)
  }

  return {
    getSelected,
    getSelectedAll,
    isSelected,
    select,
    toggle,
    unselect,
    unselectAll,
  }
})
