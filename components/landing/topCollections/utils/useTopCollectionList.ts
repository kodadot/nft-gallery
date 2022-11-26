import { CollectionEntity } from './types'

type TopCollectionListResult = {
  collectionEntities: CollectionEntity[]
}

export const useTopCollectionList = (limit: number, sort = 'volume_DESC') => {
  const topCollectionList = useState<CollectionEntity[] | null>(
    'topCollectionList'
  )
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
      topCollectionList.value = collectionEntities
    }
  })

  return { data: topCollectionList, error, loading }
}
