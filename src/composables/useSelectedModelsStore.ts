import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { reactive } from 'vue'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

export default defineStore('selectedModelsStore', () => {
  const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

  /*
  Store the real `Object3D` object for faster access without converting e.g. a stored `id: number` first
  back to the real object. Also, we would need the scene's `useTresContext()` to get the real object
  via `<context>.getObjectById(id: number): Object3D | undefined`.
  We use `reactive` instead of `ref` bc it is deeper reactive into the object. But bc a reactive can't be
  set again, we must wrap the one object we want to store in a data structure like an Array, Set, ...
  */
  const selected = reactive(new Set<Object3D>())

  /**
   * Function to get the selected Object3D instance.
   *
   * @returns {Object3D | undefined} - The selected Object3D instance or undefined if none is selected.
   */
  function getSelected(): Object3D | undefined {
    return Array.from(selected)[0]
  }

  /**
   * Checks if the given Object3D instance is the currently selected one.
   *
   * @param {Object3D} obj - The Object3D instance to check.
   * @returns {boolean} - Returns true if the given Object3D instance is selected, otherwise false.
   */
  function isSelected(obj: Object3D): boolean {
    return getSelected()?.id === obj.id
  }

  /**
   * Checks if there is any Object3D instance selected.
   *
   * @returns {boolean} - Returns true if there is at least one Object3D instance selected, otherwise false.
   */
  function hasSelected(): boolean {
    return selected.size > 0
  }

  /**
   * Selects the given Object3D instance if it is registered.
   *
   * @param {Object3D} obj - The Object3D instance to select.
   * @returns {boolean} - Returns true if the object was successfully selected, otherwise false.
   */
  function select(obj: Object3D): boolean {
    if (!registeredForSelectingModelStore.isRegistered(obj)) {
      return false
    }
    unselectAll()
    selected.add(obj)
    return true
  }

  /**
   * Unselects the given Object3D instance if it is currently selected.
   *
   * @param {Object3D} obj - The Object3D instance to unselect.
   * @returns {boolean} - Returns true if the object was successfully unselected, otherwise false.
   */
  function unselect(obj: Object3D): boolean {
    if (!isSelected(obj)) {
      return false
    }
    selected.delete(obj)
    return true
  }

  /**
   * Unselects all currently selected Object3D instances.
   *
   * @returns {boolean} - Returns true if all objects were successfully unselected.
   */
  function unselectAll(): boolean {
    selected.clear()
    return true
  }

  /**
   * Toggles the selection state of the given Object3D instance.
   * If the object is currently selected, it will be unselected.
   * If the object is not currently selected, it will be selected.
   *
   * @param {Object3D} obj - The Object3D instance to toggle.
   * @returns {boolean} - Returns true if the object's selection state was successfully toggled.
   */
  function toggle(obj: Object3D): boolean {
    if (isSelected(obj)) {
      return unselect(obj)
    }
    return select(obj)
  }

  return {
    getSelected,
    hasSelected,
    isSelected,
    select,
    toggle,
    unselect,
    unselectAll,
  }
})
