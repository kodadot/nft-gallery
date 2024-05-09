import { fetchProfileByAddress } from '@/services/profile'
import type { Profile } from '@/services/profile'

export enum Socials {
  Twitter = 'Twitter',
  Website = 'Website',
  Farcaster = 'Farcaster',
}

export default function useUserProfile() {
  const userProfileData = ref<Profile>()
  const hasProfile = ref(false)
  const { params, name } = useRoute()

  const fetchProfile = async () => {
    const account = params?.id as string
    if (!account) {
      return
    }
    try {
      const response = await fetchProfileByAddress(account)
      console.log('Profile fetch response:', response)

      userProfileData.value = response
      hasProfile.value = true
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  watch(
    [() => name, () => params],
    () => {
      if (name === 'prefix-u-id') {
        fetchProfile()
      }
    },
    { immediate: true },
  )

  return {
    hasProfile,
    userProfile: computed(() => userProfileData.value),
    fetchProfile,
  }
}
