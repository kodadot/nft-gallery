import collectionListWithSearchMinimal from '@/queries/subsquid/general/collectionListWithSearchMinimal.graphql'
import type { CollectionEntityMinimal } from '@/components/collection/utils/types'

export const getOwnedCollections = async (address: string, { first, client } = { first: 1000, client: usePrefix().client }): Promise<CollectionEntityMinimal[]> => {
  const { data } = await useAsyncQuery<{ collectionEntities: CollectionEntityMinimal[] }>({
    query: collectionListWithSearchMinimal,
    variables: {
      first: first,
      search: {
        nfts_some: {
          currentOwner_eq: address,
        },
      },
    },
    clientId: client.value,
  })

  return data.value.collectionEntities
}
