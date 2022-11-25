import { CollectionSales } from './types'

type CollectionsSalesResult = {
  collectionsSales: CollectionSales[]
}

const result = ref<CollectionSales[] | null>(null)

export const useCollectionsSales = (ids: string[]) => {
  const { data, error, loading } = useGraphql({
    queryPrefix: 'rmrk',
    queryName: 'collectionsSales',
    variables: {
      ids,
    },
  })

  watch(data, (collectionsSalesResult) => {
    if (collectionsSalesResult) {
      const { collectionsSales } =
        collectionsSalesResult as CollectionsSalesResult
      result.value = collectionsSales
    }
  })

  return { data: result, error, loading }
}
