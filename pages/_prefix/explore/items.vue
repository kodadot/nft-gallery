<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
    <Items />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import Items from '@/components/items/Items.vue'
import { usePreferencesStore } from '@/stores/preferences'

const components = { Items }

@Component<ExploreItems>({
  components,
  layout() {
    return 'explore-layout'
  },
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: `/${this.$route.params.prefix}/explore/items`,
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class ExploreItems extends mixins(ExperimentMixin) {
  get preferencesStore() {
    return usePreferencesStore()
  }
  get isSidebarOpen() {
    return this.preferencesStore.getsidebarFilterCollapse
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
