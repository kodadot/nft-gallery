import { readParam } from '@/composables/useReplaceUrl'

export const useCollectionSearch = () => {
  const query = useRoute().query
  const route = useRoute()

  const collections = readParam(query?.collections)

  const isCollectionSearchMode = computed(() => {
    return route.name === 'prefix-collection-id' && collections
  })

  return {
    isCollectionSearchMode,
  }
}
