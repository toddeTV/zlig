import { defineStore } from 'pinia'
import type { Object3D } from 'three'
import { reactive } from 'vue'

export default defineStore('registeredForSelectingModelStore', () => {
  const registered = reactive(new Set<Object3D>())

  function getRegistered(id: number): Object3D | undefined {
    return Array.from(registered).find(obj => obj.id === id)
  }

  function getRegisteredAll(): Object3D[] {
    return Array.from(registered)
  }

  function isRegistered(obj: Object3D): boolean {
    return registered.has(obj)
  }

  function register(obj: Object3D): boolean {
    if (isRegistered(obj)) {
      return false
    }
    registered.add(obj)
    return true
  }

  function unregister(obj: Object3D): boolean {
    if (!isRegistered(obj)) {
      return false
    }
    registered.delete(obj)
    return true
  }

  function unregisterAll() {
    registered.clear()
  }

  function toggle(obj: Object3D) {
    if (isRegistered(obj)) {
      unregister(obj)
    }
    else {
      register(obj)
    }
  }

  return {
    getRegistered,
    getRegisteredAll,
    isRegistered,
    register,
    toggle,
    unregister,
    unregisterAll,
  }
})
