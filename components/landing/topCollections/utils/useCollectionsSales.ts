import { CollectionSales } from './types'

type FetchCollectionsSalesResult = {
  collectionsSales: CollectionSales[]
}

const result = ref<CollectionSales[] | null>(null)

export const useCollectionsSales = (ids: string[]) => {
  const { data, error, loading } = useGraphql({
    queryPrefix: 'rmrk',
    queryName: 'collectionsSales',
    variables: {
      ids: ids,
    },
  })

  watch(data, (data) => {
    if (data) {
      const { collectionsSales } = data as FetchCollectionsSalesResult
      result.value = collectionsSales
    }
  })

  return { data: result, error, loading }
}
