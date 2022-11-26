import { CollectionSales } from './types'

type CollectionsSalesResult = {
  collectionsSales: CollectionSales[]
}

export const useCollectionsSales = (ids: string[]) => {
  const CollectionSalesList = useState<CollectionSales[] | null>(
    'CollectionSalesList'
  )

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
      CollectionSalesList.value = collectionsSales
    }
  })

  return { data: CollectionSalesList, error, loading }
}
