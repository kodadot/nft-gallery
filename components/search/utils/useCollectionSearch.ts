import { useSearchStore } from '@/stores/search'

export const useCollectionSearch = () => {
  const route = useRoute()

  const { isMobile } = useBreakpoints()

  const searchStore = useSearchStore()
  const isCollectionSearchMode = computed(() => {
    return (
      route.name === 'prefix-collection-id' &&
      searchStore.isCollectionSearchMode &&
      !isMobile.value
    )
  })

  return {
    isCollectionSearchMode,
    setCollectionSearchMode: searchStore.setCollectionSearchMode,
  }
}
