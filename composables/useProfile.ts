import { fetchProfileByAddress } from '@/services/profile'
import type { Profile } from '@/services/profile'

export enum Socials {
  Twitter = 'Twitter',
  Website = 'Website',
  Farcaster = 'Farcaster',
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
      console.log('Profile fetch response:', response)

      userProfileData.value = response
      hasProfile.value = true
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
