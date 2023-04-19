import { POPULAR_COLLECTIONS } from './constants'
import { CollectionEntityMinimal } from '@/components/collection/utils/types'

type QueryResult = {
  value: {
    collectionEntities: Collection[]
  }
}

function handleResult(
  collections: Collection[],
  result: QueryResult[],
  index: number
): Collection[] {
  const chain = Object.keys(POPULAR_COLLECTIONS)[index]
  const newCollections =
    result[index].value?.collectionEntities?.map((item) => ({
      ...item,
      owners: new Set(item.nfts.map((nft) => nft.currentOwner)).size,
      chain,
    })) || []
  return collections
    .concat(newCollections)
    .sort((a, b) => a.meta.name.localeCompare(b.meta.name))
}

export const collectionArray = ref<Collection[]>([])

export type Collection = CollectionEntityMinimal & {
  owners: number
  chain: string
  meta: {
    name: string
  }
  nfts: {
    currentOwner: string
  }[]
}

export const usePopularCollections = () => {
  const collections = ref<Collection[]>([])
  const resArr = ref<QueryResult[]>([])
  const loadingMap = reactive<{ [key: string]: { value: boolean } }>({})

  for (const [clientName, ids] of Object.entries(POPULAR_COLLECTIONS)) {
    const { data, loading } = useGraphql({
      queryName: 'collectionByIds',
      clientName,
      variables: { ids },
    })
    loadingMap[clientName] = loading
    resArr.value.push(data)
  }

  // Aoid using Array as root value for reactive() as it cannot be tracked in watch() or watchEffect(). Use ref() instead. This is a Vue-2-only limitation.
  watch(loadingMap, (val) => {
    Object.keys(val).forEach((key, index) => {
      if (!loadingMap[key].value) {
        collections.value = handleResult(collections.value, resArr.value, index)
        collectionArray.value = collections.value
        delete loadingMap[key]
      }
    })
  })

  return { collections }
}
