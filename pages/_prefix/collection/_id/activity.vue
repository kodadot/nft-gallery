<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
    <Activity />
  </div>
</template>

<script lang="ts">
import Activity from '@/components/collection/activity/Activity.vue'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import { Component, mixins } from 'nuxt-property-decorator'
import { useHistoryStore } from '@/stores/history'
import { generateCollectionImage } from '@/utils/seoImageGenerator'
import { CurrentCollection } from './index.vue'
import { usePreferencesStore } from '@/stores/preferences'

@Component<CollectionActivityPage>({
  name: 'CollectionActivityPage',
  components: {
    Activity,
  },
  layout() {
    return 'explore-layout'
  },
  head() {
    const title = this.currentlyViewedCollection.name
    const metaData = {
      title,
      type: 'profile',
      description: this.currentlyViewedCollection.description,
      url: this.$route.path,
      image: this.image,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class CollectionActivityPage extends mixins(ExperimentMixin) {
  private historyStore = useHistoryStore()
  get preferencesStore() {
    return usePreferencesStore()
  }
  get isSidebarOpen() {
    return this.preferencesStore.getsidebarFilterCollapse
  }

  get currentlyViewedCollection(): CurrentCollection {
    return this.historyStore.getCurrentlyViewedCollection
  }

  get image(): string {
    return generateCollectionImage(
      this.currentlyViewedCollection.name,
      this.currentlyViewedCollection.numberOfItems,
      this.currentlyViewedCollection.image
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
