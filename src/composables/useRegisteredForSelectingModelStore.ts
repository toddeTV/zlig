import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { reactive } from 'vue'

export default defineStore('registeredForSelectingModelStore', () => {
  // Store only the `id` of the `Object3D` object for performance reasons
  const registered = reactive(new Set<number>())

  /**
   * Retrieves all registered Object3D IDs.
   *
   * @returns {number[]} - An array of registered Object3D IDs.
   */
  function getRegisteredAll(): number[] {
    return Array.from(registered)
  }

  /**
   * Checks if the given Object3D instance is registered.
   *
   * @param {Object3D} obj - The Object3D instance to check.
   * @returns {boolean} - Returns true if the Object3D instance is registered, otherwise false.
   */
  function isRegistered(obj: Object3D): boolean {
    return registered.has(getObject3DId(obj))
  }

  /**
   * Registers the given Object3D instance.
   *
   * @param {Object3D} obj - The Object3D instance to register.
   * @returns {boolean} - Returns true if the Object3D instance was successfully registered, otherwise false.
   */
  function register(obj: Object3D): boolean {
    if (isRegistered(obj)) {
      return false
    }
    registered.add(getObject3DId(obj))
    return true
  }

  /**
   * Unregisters the given Object3D instance.
   *
   * @param {Object3D} obj - The Object3D instance to unregister.
   * @returns {boolean} - Returns true if the Object3D instance was successfully unregistered, otherwise false.
   */
  function unregister(obj: Object3D): boolean {
    if (!isRegistered(obj)) {
      return false
    }
    registered.delete(getObject3DId(obj))
    return true
  }

  /**
   * Unregisters all Object3D instances.
   */
  function unregisterAll() {
    registered.clear()
  }

  /**
   * Retrieves the ID of the given Object3D instance.
   *
   * @param {Object3D} obj - The Object3D instance to get the ID from.
   * @returns {number} - The ID of the Object3D instance.
   */
  function getObject3DId(obj: Object3D): number {
    return obj.id
  }

  return {
    getRegisteredAll,
    isRegistered,
    register,
    unregister,
    unregisterAll,
  }
})
