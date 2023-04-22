import { POPULAR_COLLECTIONS } from './constants'
import { CollectionEntityMinimal } from '@/components/collection/utils/types'

type QueryResult = {
  value: {
    collectionEntities: Collection[]
  }
}

function handleResult(
  collections: Collection[],
  result: QueryResult,
  index: number
): Collection[] {
  const chain = Object.keys(POPULAR_COLLECTIONS)[index]
  const newCollections =
    result.value?.collectionEntities?.map((item) => ({
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
  const chainData = reactive<{
    [clientName: string]: {
      loading: { value: boolean }
      queryResult: QueryResult | null
    }
  }>({})

  for (const [clientName, ids] of Object.entries(POPULAR_COLLECTIONS)) {
    const { data: queryResult, loading } = useGraphql({
      queryName: 'collectionByIds',
      clientName,
      variables: { ids },
    })
    chainData[clientName] = { loading, queryResult }
  }

  // Aoid using Array as root value for reactive() as it cannot be tracked in watch() or watchEffect(). Use ref() instead. This is a Vue-2-only limitation.
  watch(chainData, (val) => {
    Object.keys(val).forEach((chain, index) => {
      const { loading, queryResult } = chainData[chain]
      // not best but better than add an extra flag...
      if (!loading.value && queryResult !== null) {
        collections.value = handleResult(collections.value, queryResult, index)
        collectionArray.value = collections.value
        // clear queryResult, prevent to be processed again
        chainData[chain].queryResult = null
      }
    })
  })

  return { collections }
}
