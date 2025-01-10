import { useQuery } from '@tanstack/vue-query'

export function useOwnedCollections(id: Ref<string>) {
  return useQuery({
    queryKey: ['ownedCollections', id],
    queryFn: () => getOwnedCollections(id.value),
  })
}
