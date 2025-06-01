<template>
  <div class="relative w-full">
    <input
      v-if="!selectedCollection"
      v-model="searchQuery"
      type="text"
      class="w-full h-12 p-2 border border-k-shade bg-background-color text-text-color focus:border-border-color outline-hidden"
      :placeholder="$t('mint.collection.search')"
      @input="handleSearch"
    >
    <div
      v-if="showResults"
      class="absolute top-full left-0 right-0 bg-background-color border border-k-shade rounded-md max-h-[300px] overflow-y-auto z-1000"
    >
      <div
        v-for="collection in searchResults"
        :key="collection.collection_id"
        class="p-2 flex items-center cursor-pointer hover:bg-k-hover text-text-color"
        @click="selectCollection(collection)"
      >
        <div>
          <BasicImage
            :src="sanitizeIpfsUrl(collection.image, 'image')"
            custom-class="w-6 h-6 object-cover"
            rounded
          />
        </div>

        <span class="ml-2">{{ collection.name }}</span>
      </div>
    </div>

    <div
      v-if="selectedCollection"
      class="mt-2.5"
    >
      <div class="flex items-center p-2 bg-k-grey-light rounded-md gap-2 text-text-color pr-6">
        <div>
          <BasicImage
            :src="sanitizeIpfsUrl(selectedCollection.image, 'image')"
            custom-class="w-6 h-6 object-cover"
            rounded
          />
        </div>
        <span class="text-overflow-ellipsis overflow-hidden">{{ selectedCollection.name }}</span>
        <NeoButton
          variant="text"
          class="absolute right-0"
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
import debounce from 'lodash/debounce'
import { fetchCollectionSuggestion } from '@/components/search/utils/collectionSearch'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import BasicImage from '@/components/shared/view/BasicImage.vue'

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
}, {
  immediate: true,
})

const handleSearch = debounce(async () => {
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
}, 500)

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
