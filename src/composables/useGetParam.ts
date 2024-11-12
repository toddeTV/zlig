import { useRoute } from 'vue-router'

export default function () {
  const route = useRoute()

  function isparamPresent(param: string): boolean {
    return param in route.query
  }

  return {
    isparamPresent,
  }
}
