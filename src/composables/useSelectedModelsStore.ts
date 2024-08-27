import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { computed, shallowRef } from 'vue'
import useRegisteredForSelectingModelStore from '@/composables/useRegisteredForSelectingModelStore'

export default defineStore('selectedModelsStore', () => {
  const registeredForSelectingModelStore = useRegisteredForSelectingModelStore()

  /**
   * Store the real `Object3D` object for faster access without converting e.g. a stored `id: number` (or `uuid`)
   * first back to the real object. Also, we would need the scene's `useTresContext()` to get the real object
   * via `<context>.getObjectById(id: number): Object3D | undefined`.
   */
  const selected = shallowRef<Object3D | undefined>(undefined)

  /**
   * Computed property to get the selected Object3D instance.
   */
  const getSelected = computed(() => selected.value)

  /**
   * Checks if the given Object3D instance is the currently selected one.
   *
   * @param {Object3D} obj - The Object3D instance to check.
   * @returns {boolean} - Returns true if the given Object3D instance is selected, otherwise false.
   */
  function isSelected(obj: Object3D): boolean {
    return getSelected.value?.id === obj.id
  }

  /**
   * Checks if there is any Object3D instance selected.
   *
   * @returns {boolean} - Returns true if there is at least one Object3D instance selected, otherwise false.
   */
  function hasSelected(): boolean {
    return getSelected.value !== undefined
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
    selected.value = obj
    return true
  }

  /**
   * Unselects all currently selected Object3D instances.
   *
   * @returns {boolean} - Returns true if all objects were successfully unselected.
   */
  function unselect(): boolean {
    selected.value = undefined
    return true
  }

  /**
   * Unselects the given Object3D instance if it is currently selected.
   *
   * @param {Object3D} obj - The Object3D instance to unselect.
   * @returns {boolean} - Returns true if the object was successfully unselected, otherwise false.
   */
  function unselectObj(obj: Object3D): boolean {
    if (!isSelected(obj)) {
      return false
    }
    selected.value = undefined
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
      return unselectObj(obj)
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
    unselectObj,
  }
})
