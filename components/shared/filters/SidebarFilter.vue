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
      <template v-if="isCollectionActivityTab">
        <EventTypeFilter
          expanded
          fluid-padding
        />
        <IdentityVerficationFilter
          expanded
          fluid-padding
        />
      </template>
      <StatusFilter
        v-else-if="isCollectionItemsTab"
        expanded
        fluid-padding
      />
      <PriceFilter
        v-if="isCollectionItemsTab"
        fluid-padding
        data-testid="sidebar-price-filter"
      />
      <PopularCollections
        v-if="isExploreItems"
        expanded
        fluid-padding
      />
      <AdvancedFilter
        v-if="isCollectionItemsTab"
        fluid-padding
        data-testid="sidebar-advanced-filter"
      />

      <!-- Trade -->
      <TradeFilter
        v-if="isCollectionSwapsTab"
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

const isCollectionItemsTab = computed(() => route.name === 'prefix-collection-id')
const isCollectionActivityTab = computed(() => route.name === 'prefix-collection-id-activity')
const isCollectionSwapsTab = computed(() => route.name === 'prefix-collection-id-swaps')
const isExploreItems = computed(() => route.name === 'prefix-explore-items')
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
