import { useRoute } from 'vue-router'

export default function () {
  const route = useRoute()

  function isParamPresent(param: string): boolean {
    return param in route.query
  }

  return {
    isParamPresent,
  }
}
