<template>
  <div class="relative w-full">
    <input
      v-model="searchQuery"
      type="text"
      class="w-full h-12 p-2 border border-gray-300"
      :placeholder="$t('mint.collection.search')"
      @input="handleSearch"
    >
    <div
      v-if="showResults"
      class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md max-h-[300px] overflow-y-auto z-[1000]"
    >
      <div
        v-for="collection in searchResults"
        :key="collection.collection_id"
        class="p-2 flex items-center cursor-pointer hover:bg-gray-100"
        @click="selectCollection(collection)"
      >
        <img
          :src="sanitizeIpfsUrl(collection.image, 'image')"
          class="w-6 h-6 rounded-full object-cover"
        >
        <span class="ml-2">{{ collection.name }}</span>
      </div>
    </div>

    <div
      v-if="selectedCollection"
      class="mt-2.5"
    >
      <div class="flex items-center p-2 bg-gray-100 rounded-md gap-2">
        <img
          :src="sanitizeIpfsUrl(selectedCollection.image, 'image')"
          class="w-6 h-6 rounded-full object-cover"
        >
        <span>{{ selectedCollection.name }}</span>
        <NeoButton
          variant="text"
          no-shadow
          icon="xmark"
          size="small"
          @click="removeCollection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { fetchCollectionSuggestion } from '@/components/search/utils/collectionSearch'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'

type CollectionMinimal = {
  collection_id: string
  name: string
  image: string
}

const props = defineProps<{
  collectionId?: string
}>()

const emit = defineEmits<{
  (e: 'update:collection', collection: CollectionMinimal | null): void
}>()

const { urlPrefix } = usePrefix()
const searchQuery = ref('')
const searchResults = ref<CollectionMinimal[]>([])
const selectedCollection = ref<CollectionMinimal | null>(null)
const showResults = ref(false)

const { collection: initialCollection } = useCollectionMinimal({
  collectionId: computed(() => props.collectionId),
})

watch(initialCollection, (newCollection) => {
  if (newCollection) {
    selectedCollection.value = {
      collection_id: newCollection.id,
      name: newCollection.name,
      image: newCollection.meta.image,
    }
  }
})

const handleSearch = async () => {
  if (!searchQuery.value) {
    searchResults.value = []
    showResults.value = false
    return
  }

  const results = await fetchCollectionSuggestion(
    searchQuery.value,
    3,
    urlPrefix.value,
  )
  searchResults.value = results
  showResults.value = true
}

const selectCollection = (collection: CollectionMinimal) => {
  selectedCollection.value = collection
  emit('update:collection', collection)
  searchQuery.value = ''
  showResults.value = false
}

const removeCollection = () => {
  selectedCollection.value = null
  emit('update:collection', null)
}
</script>
