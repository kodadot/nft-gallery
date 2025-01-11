<template>
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
    v-if="isCollectionTrades"
    expanded
    fluid-padding
  />
</template>

<script lang="ts" setup>
import StatusFilter from '@/components/shared/filters/modules/StatusFilter.vue'
import TradeFilter from '@/components/shared/filters/modules/TradeFilter.vue'
import EventTypeFilter from '@/components/shared/filters/modules/EventTypeFilter.vue'
import PriceFilter from '@/components/shared/filters/modules/PriceFilter.vue'
import AdvancedFilter from '@/components/shared/filters/modules/AdvancedFilter.vue'
import PopularCollections from '@/components/shared/filters/modules/PopularCollections.vue'

const route = useRoute()

const isCollectionItems = computed(() => route.name === 'prefix-collection-id')
const isCollectionActivity = computed(() => route.name === 'prefix-collection-id-activity')
const isCollectionTrades = computed(() => ['prefix-collection-id-swaps', 'prefix-collection-id-offers'].includes(route.name))
const isExploreItems = computed(() => route.name === 'prefix-explore-items')
const isPageWithItems = computed(() => isExploreItems.value || isCollectionItems.value)
</script>
