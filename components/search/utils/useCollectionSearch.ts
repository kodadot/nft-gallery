import { useSearchStore } from '@/stores/search'

export const useCollectionSearch = () => {
  const route = useRoute()
  const windowSize = useWindowSize()

  const isMobile = computed(() => windowSize.width.value < 1024)

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
