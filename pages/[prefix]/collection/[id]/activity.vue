<template>
  <div
    class="w-full px-[1.25rem] md:px-[2.5rem]"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
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

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.sidebar-padding-left {
  padding-left: 0;
}

// this cover the edge case where sidebar is open and then screen size changes to mobile
// for exmpale on rotation of tablet device
// in that case the padding need to match that of the fluid container
@include mobile {
  .sidebar-padding-left {
    padding-left: $fluid-container-padding-mobile;
  }
}
</style>
