import type { TresObject } from '@tresjs/core'
import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export default defineStore('clickedModelNodeStore', () => {
  const activeObject = ref<TresObject | undefined>(undefined)
  const activeUuid = computed<string | undefined>(() => activeObject.value?.uuid)

  return {
    activeObject,
    activeUuid: readonly(activeUuid),
  }
})
