import { CollectionEntityMinimal } from '@/components/collection/utils/types'

type CollectionData = {
  value: {
    collectionEntities: Collection[]
  }
}

function handleResult(collections: Collection[], chain: string): Collection[] {
  const newCollections =
    collections?.map((item) => ({
      ...item,
      owners: new Set(item.nfts.map((nft) => nft.currentOwner)).size,
      chain,
    })) || []
  return newCollections.sort((a, b) => a.meta.name?.localeCompare(b.meta.name))
}

function getCollections(chain: string): string[] {
  return ALL_POPULAR_COLLECTIONS[chain] || []
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
  const collectionIds = getCollections(chain)
  const { data: queryResult, loading } = useGraphql({
    queryName: 'collectionByIds',
    variables: { ids: collectionIds },
  })

  watch([queryResult, loading], () => {
    if (!loading.value && queryResult.value) {
      collections.value = handleResult(
        (queryResult as CollectionData).value.collectionEntities,
        chain,
      )
      collectionArray.value = collections.value
    }
  })

  return { collections }
}
