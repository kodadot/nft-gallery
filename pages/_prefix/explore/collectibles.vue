<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
    <div class="is-flex is-align-self-flex-start">
      <SidebarFilter />
      <CollectionList />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import { usePreferencesStore } from '@/stores/preferences'
import SidebarFilter from '@/components/shared/filters/SidebarFilter.vue'

const components = { SidebarFilter }

@Component<ExploreCollectibles>({
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
      url: `/${this.$route.params.prefix}/explore/collectibles`,
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class ExploreCollectibles extends mixins(ExperimentMixin) {
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

@include mobile {
  .sidebar-padding-left {
    padding-left: $fluid-container-padding-mobile;
  }
}
</style>
