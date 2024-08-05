import { useQuery } from '@tanstack/vue-query'
import { fetchProfilesByIds } from '@/services/profile'
import type { Profile } from '@/services/profile'

export default function useProfiles(queryKey: string, addresses: ComputedRef<string[]>, queryOptions?: { staleTime?: number }) {
  return useQuery<
    Profile[]
  >({
    queryKey: [
      queryKey,
      computed(() => `${addresses.value.sort().join(',')}`),
    ],
    queryFn: () =>
      addresses.value.length
        ? fetchProfilesByIds(addresses.value)
        : [],
    ...queryOptions,

  })
}
