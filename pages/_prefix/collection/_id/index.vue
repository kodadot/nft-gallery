<template>
  <div
    v-if="redesign"
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
    <Items />
  </div>
  <CollectionItem v-else />
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import CollectionItem from '@/components/rmrk/Gallery/CollectionItem.vue'
import { generateCollectionImage } from '~/utils/seoImageGenerator'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import Items from '@/components/items/Items.vue'
import { useHistoryStore } from '@/stores/history'

type CurrentCollection = {
  name: string
  numberOfItems: number
  image: string
  description: string
}

@Component<CollectionItemPage>({
  name: 'CollectionItemPage',
  components: {
    CollectionItem,
    Items,
  },
  layout(context) {
    return context.query.redesign === 'true' ? 'explore-layout' : 'default'
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
export default class CollectionItemPage extends mixins(ExperimentMixin) {
  private historyStore = useHistoryStore()
  // private preferencesStore = usePreferencesStore()
  // get isSidebarOpen() {
  //   return preferencesStore.getsidebarFilterCollapse
  // }

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

  get isSidebarOpen() {
    return this.$store.getters['preferences/getsidebarFilterCollapse']
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
