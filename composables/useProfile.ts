import { fetchProfileByAddress } from '@/services/profile'
import type { Profile } from '@/services/profile'

export enum Socials {
  Twitter,
  Website,
  Farcaster,
}

export default function useUserProfile() {
  const { accountId } = useAuth()
  const userProfileData = ref<Profile | null>(null)
  const hasProfile = ref(false)
  const isFollowingThisAccount = ref(false)

  const fetchProfileMedia = async () => {
    if (!accountId.value) {
      return
    }
    try {
      const response = await fetchProfileByAddress(accountId.value)
      if (response.success && response.data) {
        userProfileData.value = response.data
        hasProfile.value = true
      } else {
        console.error('Profile fetch error:', response.message)
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  watch(accountId, fetchProfileMedia, { immediate: true })

  return {
    hasProfile,
    isFollowingThisAccount,
    userProfile: computed(() => userProfileData.value),
  }
}
