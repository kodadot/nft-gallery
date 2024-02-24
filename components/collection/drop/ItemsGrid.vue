<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="title is-3">{{ $t('drops.latestMints') }}</h3>

      <div class="flex gap-4">
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
