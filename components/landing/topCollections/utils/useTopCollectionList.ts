import { CollectionEntity } from './types'

type FetchTopCollectionListResult = {
  collectionEntities: CollectionEntity[]
}

const result = ref<CollectionEntity[] | null>(null)

export const useTopCollectionList = (limit: number, sort = 'volume_DESC') => {
  const { data, error, loading } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'topCollectionList',
    variables: {
      orderBy: sort,
      limit: limit,
    },
  })
  watch(data, (data) => {
    if (data) {
      const { collectionEntities } = data as FetchTopCollectionListResult
      result.value = collectionEntities
    }
  })

  return { data: result, error, loading }
}
