<template>
  <div
    :class="{ 'bordered sticky': open }"
    class="is-hidden-mobile"
  >
    <NeoSidebar
      :reduce="false"
      :open="open"
      fullheight
    >
      <template v-if="isCollectionActivity">
        <EventTypeFilter
          expanded
          fluid-padding
        />
        <IdentityVerficationFilter
          expanded
          fluid-padding
        />
      </template>

      <template v-if="isPageWithItems">
        <StatusFilter
          expanded
          fluid-padding
        />
        <PriceFilter
          fluid-padding
          data-testid="sidebar-price-filter"
        />
      </template>

      <PopularCollections
        v-if="isExploreItems"
        expanded
        fluid-padding
      />

      <AdvancedFilter
        v-if="isPageWithItems"
        fluid-padding
        data-testid="sidebar-advanced-filter"
      />

      <TradeFilter
        v-if="isCollectionSwaps"
        expanded
        fluid-padding
      />
    </NeoSidebar>
  </div>
</template>

<script lang="ts" setup>
import { NeoSidebar } from '@kodadot1/brick'
import StatusFilter from '@/components/shared/filters/modules/StatusFilter.vue'
import TradeFilter from '@/components/shared/filters/modules/TradeFilter.vue'
import EventTypeFilter from '@/components/shared/filters/modules/EventTypeFilter.vue'
import PriceFilter from '@/components/shared/filters/modules/PriceFilter.vue'
import AdvancedFilter from '@/components/shared/filters/modules/AdvancedFilter.vue'
import PopularCollections from '@/components/shared/filters/modules/PopularCollections.vue'
import { usePreferencesStore } from '@/stores/preferences'

const route = useRoute()
const preferencesStore = usePreferencesStore()
const open = computed(() => preferencesStore.getsidebarFilterCollapse)

const isCollectionItems = computed(() => route.name === 'prefix-collection-id')
const isCollectionActivity = computed(() => route.name === 'prefix-collection-id-activity')
const isCollectionSwaps = computed(() => route.name === 'prefix-collection-id-swaps')
const isExploreItems = computed(() => route.name === 'prefix-explore-items')
const isPageWithItems = computed(() => isExploreItems.value || isCollectionItems.value)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
.bordered {
  border-right: 1px solid;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 84px;
  height: calc(100vh - 84px);
  margin-right: $fluid-container-padding;
  overflow-y: auto;
  flex-shrink: 0;
}

.o-side {
  position: relative;
}
</style>
