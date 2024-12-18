<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }"
  >
    <CollectionActivity />
  </div>
</template>

<script lang="ts" setup>
import { useHistoryStore } from '@/stores/history'
import { usePreferencesStore } from '@/stores/preferences'
import { generateCollectionImage } from '@/utils/seoImageGenerator'

const historyStore = useHistoryStore()
const preferencesStore = usePreferencesStore()

const isSidebarOpen = computed(() => preferencesStore.getsidebarFilterCollapse)

const currentlyViewedCollection = computed(
  () => historyStore.getCurrentlyViewedCollection,
)

const image = computed(() => {
  return generateCollectionImage(
    currentlyViewedCollection.value.name,
    currentlyViewedCollection.value.numberOfItems,
    currentlyViewedCollection.value.image,
  )
})

definePageMeta({
  layout: 'explore-layout',
})

useHead({
  title: currentlyViewedCollection.value.name,
  meta: [
    {
      name: 'description',
      content: currentlyViewedCollection.value.description,
    },
    {
      name: 'image',
      content: image.value,
    },
  ],
})
</script>
