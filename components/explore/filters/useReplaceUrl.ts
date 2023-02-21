export default function () {
  const { $consola } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()
  const replaceUrl = (queryCondition: { [key: string]: unknown }) => {
    router
      .replace({
        path: String(route.path),
        query: {
          ...route.query,
          ...queryCondition,
          page: '1',
        },
      })
      .catch($consola.warn)
  }

  return {
    replaceUrl,
  }
}
