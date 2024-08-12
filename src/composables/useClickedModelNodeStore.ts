import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { reactive } from 'vue'

export default defineStore('clickedModelNodeStore', () => {
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

  function unselectAll() {
    selected.clear()
  }

  function toggle(obj: Object3D) {
    if (isSelected(obj)) {
      unselect(obj)
    }
    else {
      select(obj)
    }
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
