import { POPULAR_COLLECTIONS } from './constants'

export const usePopularCollections = () => {
  const collections = ref<any[]>([])
  const resArr = ref<any[]>([])
  const loadingMap = reactive({})

  for (const [clientName, ids] of Object.entries(POPULAR_COLLECTIONS)) {
    const { data, loading } = useGraphql({
      queryName: 'collectionByIds',
      clientName,
      variables: {
        ids,
      },
    })
    loadingMap[clientName] = loading
    resArr.value.push(data)
  }

  // Aoid using Array as root value for reactive() as it cannot be tracked in watch() or watchEffect(). Use ref() instead. This is a Vue-2-only limitation.
  watch(loadingMap, (val) => {
    if (Object.entries(val).every(([client, loading]) => !loading.value)) {
      collections.value = resArr.value
        .map((data, index) => {
          const chain = Object.keys(POPULAR_COLLECTIONS)[index]
          return data.value?.collectionEntities?.map((item) => ({
            chain,
            ...item,
          }))
        })
        .flat()
    }
  })

  return {
    collections,
  }
}
