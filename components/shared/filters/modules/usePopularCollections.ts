import { POPULAR_COLLECTIONS } from './constants'
import { CollectionEntityMinimal } from '@/components/collection/utils/types'
const collectionArray = ref<CollectionEntityMinimal[]>([])

export type Collection = CollectionEntityMinimal & {
  nftCount: number
  chain: string
  meta: {
    name: string
  }
}

export const useCollectionArray = () => {
  return collectionArray
}

export const usePopularCollections = () => {
  const collections = ref<Collection[]>([])
  const resArr = ref<any[]>([])
  const loadingMap = reactive<{
    [key: string]: { value: boolean }
  }>({})

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
            owners: new Set(item.nfts.map((x) => x.currentOwner)).size,
            ...item,
          }))
        })
        .flat()
      collectionArray.value = collections.value
    }
  })

  return {
    collections,
  }
}
