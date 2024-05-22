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

  const { profile, refetch: fetchProfile } = useFetchProfile(
    params?.id as string,
  )

  watch(profile, (newProfile) => {
    hasProfile.value = !!newProfile
    if (newProfile) {
      userProfileData.value = newProfile
    }
  })

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
