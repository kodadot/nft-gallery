export const replaceBooleanWithStrings = (
  obj: Record<string, string | null | boolean | undefined | number>
): Record<string, string | null | undefined> => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key] =
      typeof value === 'boolean' || typeof value === 'number'
        ? String(value)
        : value
    return result
  }, {})
}

export const readParam = (param) => {
  if (param === 'undefined' || param === null || param === undefined) {
    return undefined
  }
  if (param === 'true') {
    return true
  }
  if (param === 'false') {
    return false
  }
  return param
}

export const is = (queryParam: string | undefined) => {
  return Boolean(readParam(queryParam))
}

export default function (
  { resetPage }: { resetPage?: boolean } = { resetPage: true }
) {
  const { $consola } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()
  const replaceUrl = (queryCondition: {
    [key: string]: string | null | boolean | undefined | number
  }) => {
    const query = {
      ...route.query,
      ...replaceBooleanWithStrings(queryCondition),
    }
    if (resetPage) {
      delete query.page
    }
    router
      .replace({
        path: String(route.path),
        query,
      })
      .catch($consola.warn)
  }

  const setDefaultUrl = (params: Record<string, string | boolean>) => {
    if (route.path.includes('/explore/items')) {
      params.default = 'true'
      for (const [key] of Object.entries(params)) {
        if (route.query[key] !== undefined) {
          delete params[key]
        }
      }
      replaceUrl(params)
    }
  }

  return {
    replaceUrl,
    setDefaultUrl,
  }
}
