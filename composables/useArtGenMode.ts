export const enabledOnPages = [
  'prefix-explore-items', // explore items page
  'prefix-explore-collectibles', // explore collections page
]

export default function () {
  const route = useRoute()

  return {
    artGenModeEnabled: computed(() =>
      isArtGenDomain && enabledOnPages.includes(route.name as string ?? ''),
    ),
  }
}
