export enum Socials {
  Twitter = 'Twitter',
  Website = 'Website',
  Farcaster = 'Farcaster',
}

export default function useUserProfile() {
  const { params } = useRoute()

  const {
    profile,
    refetch: fetchProfile,
    isLoading,
  } = useFetchProfile(params?.id as string)

  return {
    hasProfile: computed(() => isLoading.value || !!profile.value),
    userProfile: profile,
    fetchProfile,
    isFetchingProfile: isLoading,
  }
}
