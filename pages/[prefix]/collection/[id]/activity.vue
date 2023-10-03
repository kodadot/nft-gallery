<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
    <Activity />
  </div>
</template>

<script lang="ts">
import Activity from '@/components/collection/activity/Activity.vue'
import { useHistoryStore } from '@/stores/history'
import { usePreferencesStore } from '@/stores/preferences'
import { generateCollectionImage } from '@/utils/seoImageGenerator'

definePageMeta({
  layout: 'explore-layout',
})

export default {
  name: 'CollectionActivityPage',
  components: {
    Activity,
  },
  setup() {
    const preferencesStore = usePreferencesStore()
    const isSidebarOpen = computed(
      () => preferencesStore.getsidebarFilterCollapse
    )

    return {
      isSidebarOpen,
    }
  },
  head() {
    const historyStore = useHistoryStore()
    const currentlyViewedCollection = computed(
      () => historyStore.getCurrentlyViewedCollection
    )
    const image = computed(() => {
      return generateCollectionImage(
        currentlyViewedCollection.value.name,
        currentlyViewedCollection.value.numberOfItems,
        currentlyViewedCollection.value.image
      )
    })
    const title = currentlyViewedCollection.value.name
    const metaData = {
      title,
      type: 'profile',
      description: currentlyViewedCollection.value.description,
      url: this.$route.path,
      image: image.value,
    }

    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
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
