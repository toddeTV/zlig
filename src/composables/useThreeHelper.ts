import type { Group, Object3D, Scene } from 'three'

export default function () {
  function addShadow(
    object: Object3D,
    shadowMode: 'both' | 'cast' | 'receive' = 'both',
  ) {
    if (object.children.length > 0) {
      object.children.forEach(child => addShadow(child))
      return
    }
    if (shadowMode === 'both' || shadowMode === 'cast') {
      object.castShadow = true
    }
    if (shadowMode === 'both' || shadowMode === 'receive') {
      object.receiveShadow = true
    }
  }

  function addToGroup(
    group: Scene | Group | Object3D,
    object: Object3D,
  ) {
    group.add(object)
  }

  function addShadowAndAddToGroup(
    group: Scene | Group | Object3D,
    object: Object3D,
    shadowMode: 'both' | 'cast' | 'receive' = 'both',
  ) {
    addShadow(object, shadowMode)
    addToGroup(group, object)
  }

  return {
    addShadow,
    addShadowAndAddToGroup,
    addToGroup,
  }
}
