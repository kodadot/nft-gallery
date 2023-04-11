import { remove } from 'cypress/types/lodash'

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

  return {
    replaceUrl,
  }
}
