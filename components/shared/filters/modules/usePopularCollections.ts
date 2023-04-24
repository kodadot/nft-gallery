import { POPULAR_COLLECTIONS as ALL_POPULAR_COLLECTIONS } from './constants'
import { CollectionEntityMinimal } from '@/components/collection/utils/types'

type QueryResult = {
  value: {
    collectionEntities: Collection[]
  }
}

function handleResult(
  collections: Collection[],
  result: QueryResult,
  chain: string
): Collection[] {
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

function getCollections(chain: string): { [chain: string]: string[] } {
  if (ALL_POPULAR_COLLECTIONS[chain]) {
    return { [chain]: ALL_POPULAR_COLLECTIONS[chain] }
  }
  return {}
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

export const usePopularCollections = (chain: string) => {
  const collections = ref<Collection[]>([])
  const chainData = reactive<{
    [clientName: string]: {
      loading: { value: boolean }
      queryResult: QueryResult | null
    }
  }>({})
  const POPULAR_COLLECTIONS = getCollections(chain)
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
    Object.keys(val).forEach((chain) => {
      const { loading, queryResult } = chainData[chain]
      // not best but better than add an extra flag...
      if (!loading.value && queryResult !== null) {
        collections.value = handleResult(collections.value, queryResult, chain)
        collectionArray.value = collections.value
        // clear queryResult, prevent to be processed again
        chainData[chain].queryResult = null
      }
    })
  })

  return { collections }
}
