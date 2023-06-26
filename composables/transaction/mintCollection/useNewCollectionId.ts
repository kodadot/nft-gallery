import { getRandomValues } from '@/components/unique/utils'
import { mapToId } from '@/utils/mappers'
import { unwrapSafe } from '@/utils/uniquery'

export function useNewCollectionId() {
  const newCollectionId = ref<number>()
  const randomNumbers = getRandomValues(10).map(String)

  const { data, error, loading, refetch } = useGraphql({
    queryName: 'existingCollectionList',
    variables: {
      ids: randomNumbers,
    },
  })

  watch(data, () => {
    if (data.value) {
      const collectionEntities = data.value.collectionEntities
      const collectionList = unwrapSafe(collectionEntities)
      const existingIds = collectionList.map(mapToId)
      const newId = randomNumbers.find((id) => !existingIds.includes(id))
      newCollectionId.value = Number(newId)
    }
  })

  return {
    newCollectionId,
    loading,
    error,
    refetch,
  }
}

export function useStatemineNewCollectionId() {
  const { apiInstance } = useApi()
  const { $consola } = useNuxtApp()
  const nextCollectionId = ref<number>()
  const unsubscribe = ref<() => void>()

  const getCollectionId = async () => {
    const api = await apiInstance.value

    const unsub = await api.query.nfts.nextCollectionId((result) => {
      nextCollectionId.value = result.unwrap().toNumber()
    })

    unsubscribe.value = unsub
  }

  getCollectionId().catch((e) => {
    $consola.error('Error getting collection id', e)
  })

  return {
    nextCollectionId,
    unsubscribe,
  }
}
