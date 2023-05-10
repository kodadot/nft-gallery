import { readParam } from '@/composables/useReplaceUrl'

export const useCollectionSearch = () => {
  const query = useRoute().query
  const route = useRoute()

  const collectionId = readParam(query?.collectionId)

  const isCollectionSearchMode = computed(() => {
    return route.name === 'prefix-collection-id' && collectionId
  })

  return {
    isCollectionSearchMode,
  }
}
