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
        v-else
        expanded
        fluid-padding
      />
      <PriceFilter
        v-if="!isCollectionActivityTab"
        fluid-padding
        data-testid="sidebar-price-filter"
      />
      <PopularCollections
        v-if="isExploreItems"
        expanded
        fluid-padding
      />
      <AdvancedFilter
        v-if="!isCollectionActivityTab"
        fluid-padding
        data-testid="sidebar-advanced-filter"
      />
    </NeoSidebar>
  </div>
</template>

<script lang="ts" setup>
import { NeoSidebar } from '@kodadot1/brick'
import StatusFilter from '@/components/shared/filters/modules/StatusFilter.vue'
import EventTypeFilter from '@/components/shared/filters/modules/EventTypeFilter.vue'
import PriceFilter from '@/components/shared/filters/modules/PriceFilter.vue'
import AdvancedFilter from '@/components/shared/filters/modules/AdvancedFilter.vue'
import PopularCollections from '@/components/shared/filters/modules/PopularCollections.vue'
import { usePreferencesStore } from '@/stores/preferences'

const route = useRoute()
const preferencesStore = usePreferencesStore()
const open = computed(() => preferencesStore.getsidebarFilterCollapse)
const isCollectionActivityTab = computed(
  () => route.name === 'prefix-collection-id-activity',
)
const isExploreItems = computed(() => route.name === 'prefix-explore-items')
</script>
