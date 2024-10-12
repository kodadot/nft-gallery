const enabledOnPages = [
  'prefix-explore-items', // explore items page
  'prefix-explore-collectibles', // explore collections page
]

const enabledPrefix = ['ahp', 'base', 'mnt']

export default function () {
  const route = useRoute()
  const { urlPrefix } = usePrefix()
  const genArtModeFeatureEnabled = computed(() => isArtGenDomain && enabledPrefix.includes(urlPrefix.value) && enabledOnPages.includes(route.name?.toString() ?? ''))
  const genArtModeEnabled = computed(() =>
    genArtModeFeatureEnabled.value && route.query.gen_art?.toString() === 'true',
  )
  return {
    genArtModeEnabled,
    genArtModeFeatureEnabled,
  }
}
