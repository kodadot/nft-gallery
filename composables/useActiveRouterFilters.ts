export default function useActiveRouterFilters() {
  const route = useRoute()
  const activeFilters = computed(() => {
    const query = { ...route.query, redesign: undefined }
    type QueryValue = string | undefined
    const entries = Object.entries<QueryValue>(query).filter(
      ([key, value]) =>
        (key === 'search' && Boolean(value)) ||
        (key === 'min' && value) ||
        (key === 'max' && value) ||
        (key === 'collections' && value) ||
        value === 'true'
    )
    return Object.fromEntries(entries)
  })

  return activeFilters
}
