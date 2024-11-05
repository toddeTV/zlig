import type { Group, Object3D, Scene } from 'three'

export function addShadow(
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

export function addShadowAndAddToGroup(
  group: Scene | Group | Object3D,
  object: Object3D,
  shadowMode: 'both' | 'cast' | 'receive' = 'both',
) {
  addShadow(object, shadowMode)
  group.add(object)
}
