import { useQuery } from '@tanstack/vue-query'
import { fetchProfileByAddress, toSubstrateAddress } from '@/services/profile'
import type { Profile } from '@/services/profile'

export default function useFetchProfile(address?: string) {
  const {
    data: profile,
    isPending,
    isLoading,
    refetch,
  } = useQuery<Profile | null>({
    queryKey: [
      'user-profile',
      computed(() => address && toSubstrateAddress(address)),
    ],
    queryFn: () => (address ? fetchProfileByAddress(address!) : null),
    staleTime: 1000 * 10,
  })

  return {
    profile,
    isPending,
    refetch,
    isLoading,
  }
}
