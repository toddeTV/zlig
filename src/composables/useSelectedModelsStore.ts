import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { reactive } from 'vue'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

export default defineStore('selectedModelsStore', () => {
  const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

  // we use `reactive` instead of `ref` bc it is deeper reactive into the object. But bc a reactive can't be
  // set again, we must wrap the one object we want to store in a data structure like an Array, Set, ...
  const selected = reactive(new Set<Object3D>())

  function getSelected(): Object3D | undefined {
    return Array.from(selected)[0]
  }

  function isSelected(obj: Object3D): boolean {
    return getSelected()?.id === obj.id
  }

  function select(obj: Object3D): boolean {
    if (!registeredForSelectingModelStore.isRegistered(obj)) {
      return false
    }
    unselectAll()
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
    isSelected,
    select,
    toggle,
    unselect,
    unselectAll,
  }
})
