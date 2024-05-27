import { fetchProfileByAddress, toSubstrateAddress } from '@/services/profile'
import type { Profile } from '@/services/profile'
import { useQuery } from '@tanstack/vue-query'

export default function useFetchProfile(address?: string) {
  const {
    data: profile,
    isPending,
    refetch,
  } = useQuery<Profile | null>({
    queryKey: [
      'user-profile',
      computed(() => address && toSubstrateAddress(address)),
    ],
    queryFn: () => (address ? fetchProfileByAddress(address!) : null),
    staleTime: 1000 * 60 * 5,
  })

  return {
    profile,
    isPending,
    refetch,
  }
}
