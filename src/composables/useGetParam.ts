let params = {}

export default function () {
  function init(newParams: any) {
    params = newParams
  }

  function isParamPresent(param: string): boolean {
    return param in params
  }

  return {
    init,
    isParamPresent,
  }
}
