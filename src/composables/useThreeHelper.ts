import type { Group, Object3D, Scene } from 'three'

export default function () {
  function addShadow(
    object: Object3D,
  ) {
    if (object.children.length > 0) {
      object.children.forEach(child => addShadow(child))
      return
    }
    object.castShadow = true
    object.receiveShadow = true
  }

  function addShadowAndAddToGroup(
    group: Scene | Group,
    object: Object3D,
  ) {
    addShadow(object)
    group.add(object)
  }

  return {
    addShadow,
    addShadowAndAddToGroup,
  }
}
