export enum Socials {
  Twitter = 'Twitter',
  Website = 'Website',
  Farcaster = 'Farcaster',
}

export default function useUserProfile() {
  const { params } = useRoute()
  const { accountId } = useAuth()

  const {
    profile,
    refetch: fetchProfile,
    isLoading,
  } = useFetchProfile(computed(() => params?.id as string || accountId.value))

  return {
    hasProfile: computed(() => Boolean(profile.value)),
    userProfile: profile,
    fetchProfile,
    isFetchingProfile: isLoading,
  }
}
