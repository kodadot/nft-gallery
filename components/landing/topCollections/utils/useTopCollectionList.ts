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
  watch(data, () => {
    if (data.value) {
      const { collectionEntities } =
        data.value as unknown as FetchTopCollectionListResult
      result.value = collectionEntities
    }
  })

  return { data: result, error, loading }
}
