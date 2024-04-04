export default () => {
  const route = useRoute()

  const hasItems = computed(() =>
    ['prefix-explore-items', 'prefix-collection-id'].includes(
      route.name?.toString() ?? '',
    ),
  )

  return { hasItems }
}
