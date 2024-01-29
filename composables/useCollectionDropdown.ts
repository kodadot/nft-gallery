import { MintedCollection } from '@/composables/transaction/types'

export default () => {
  const route = useRoute()
  const router = useRouter()

  const selectedCollection = ref<MintedCollection>()
  const preselectedCollectionId = ref<string | undefined>(
    route.query.collectionId?.toString(),
  )

  const onCollectionSelected = (collection: MintedCollection) => {
    selectedCollection.value = collection

    if (collection.id === preselectedCollectionId.value) {
      clearPreselectedCollection()
    }
  }

  const clearPreselectedCollection = () => {
    preselectedCollectionId.value = undefined
    router.replace({ query: { collectionId: undefined } })
  }

  return { selectedCollection, preselectedCollectionId, onCollectionSelected }
}
