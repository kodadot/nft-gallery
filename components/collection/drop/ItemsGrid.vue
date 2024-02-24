<template>
  <div>
    <div class="flex items-center justify-between mb-14">
      <h3 class="text-[2rem] font-bold leading-[1.125]">
        {{ $t('drops.latestMints') }}
      </h3>

      <div class="flex gap-4 items-center">
        <ProfileOrderByDropdown no-shadow rounded :preselect="defaultSort" />
        <ProfileFilterButton
          :label="$t('sort.listed')"
          url-param="listed"
          data-testid="drop-filter-button-buynow" />
      </div>
    </div>

    <ItemsGrid
      :search="itemsGridSearch"
      :grid-size="'medium'"
      display-name-with-sn
      collection-popover-hide
      show-timestamp
      :reset-search-query-params="['sort']" />
  </div>
</template>

<script setup lang="ts">
import ItemsGrid from '@/components/items/ItemsGrid/ItemsGrid.vue'

const defaultSort = 'blockNumber_DESC'

const props = defineProps<{
  collectionId: string
}>()

const route = useRoute()

const itemsGridSearch = computed(() => {
  const query: Record<string, any> = {
    collection: {
      id_eq: props.collectionId,
    },
    burned_eq: false,
  }

  if (route.query?.listed === 'true') {
    query['price_gt'] = 0
  }

  return query
})
</script>
