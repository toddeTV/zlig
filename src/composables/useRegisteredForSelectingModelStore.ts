import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { reactive } from 'vue'

export default defineStore('registeredForSelectingModelStore', () => {
  // store only the `id` of the `Object3D` object for performance reasons
  const registered = reactive(new Set<number>())

  function getRegisteredAll(): number[] {
    return Array.from(registered)
  }

  function isRegistered(obj: Object3D): boolean {
    return registered.has(getObject3DId(obj))
  }

  function register(obj: Object3D): boolean {
    if (isRegistered(obj)) {
      return false
    }
    registered.add(getObject3DId(obj))
    return true
  }

  function unregister(obj: Object3D): boolean {
    if (!isRegistered(obj)) {
      return false
    }
    registered.delete(getObject3DId(obj))
    return true
  }

  function unregisterAll() {
    registered.clear()
  }

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
