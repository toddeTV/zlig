import type { TresObject } from '@tresjs/core'
import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export default defineStore('clickedModelNodeStore', () => {
  const activeObjects = ref<TresObject[]>([])
  const activeUuids = computed<string[]>(() => activeObject.value.map(o => o.uuid))

  return {
    activeObjects,
    activeUuids: readonly(activeUuids),
  }
})
