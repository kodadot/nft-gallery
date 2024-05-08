import { fetchProfileByAddress } from '@/services/profile'
import type { Profile } from '@/services/profile'

export default function useFetchProfile(address: Ref<string | undefined>) {
  const { data: profile } = useAsyncData<Profile | null>(
    `userProfile-${address.value}`,
    () => {
      if (address.value) {
        return fetchProfileByAddress(address.value)
      }
      return Promise.resolve(null)
    },
    {
      watch: [address],
    },
  )

  return {
    profile,
  }
}
