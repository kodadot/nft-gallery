import { useQuery } from '@tanstack/vue-query'
import collectionIdList from '@/queries/subsquid/general/collectionIdList.graphql'

export function useOwnedCollections(id: Ref<string>, { client = usePrefix().client } = {}) {
  return useQuery({
    queryKey: ['ownedCollections', id],
    queryFn: async () => {
      const { data } = await useAsyncQuery<{ collectionEntities: { id: string }[] }>({
        query: collectionIdList,
        variables: {
          search: {
            nfts_some: {
              currentOwner_eq: id.value,
            },
          },
        },
        clientId: client.value,
      })

      return data.value.collectionEntities
    },
  })
}
