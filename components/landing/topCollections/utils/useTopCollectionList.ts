import { CollectionEntity } from './types'

type TopCollectionListResult = {
  collectionEntities: CollectionEntity[]
}

const result = ref<CollectionEntity[] | null>(null)

export const useTopCollectionList = (limit: number, sort = 'volume_DESC') => {
  const { data, error, loading } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'topCollectionList',
    variables: {
      orderBy: sort,
      limit,
    },
  })
  watch(data, (topCollectionListResult) => {
    if (topCollectionListResult) {
      const { collectionEntities } =
        topCollectionListResult as TopCollectionListResult
      result.value = collectionEntities
    }
  })

  return { data: result, error, loading }
}
