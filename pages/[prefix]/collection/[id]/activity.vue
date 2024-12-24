<template>
  <ExploreLayoutWithSidebar>
    <CollectionActivity />
  </ExploreLayoutWithSidebar>
</template>

<script lang="ts" setup>
const { getCurrentlyViewedCollection: currentlyViewedCollection } = storeToRefs(useHistoryStore())

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
