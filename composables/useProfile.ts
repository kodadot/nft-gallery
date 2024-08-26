export enum Socials {
  Twitter = 'Twitter',
  Website = 'Website',
  Farcaster = 'Farcaster',
}

export default function useUserProfile(address?: Ref<string>) {
  const { accountId } = useAuth()

  const {
    profile,
    refetch: fetchProfile,
    isLoading,
  } = useFetchProfile(computed(() => address?.value || accountId.value))

  return {
    hasProfile: computed(() => Boolean(profile.value)),
    userProfile: profile,
    fetchProfile,
    isFetchingProfile: isLoading,
  }
}
