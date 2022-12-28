<template>
  <div>
    <div v-if="$route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ $route.query.search }}</span>
    </div>
    <o-tabs
      v-model="selectedTab"
      data-cy="tabs"
      class="explore-tabs"
      content-class="explore-tabs-content">
      <o-tab-item :label="$t('collections')" value="collectibles">
        <template v-if="selectedTab === 'collectibles'">
          <CollectionList />
        </template>
      </o-tab-item>

      <o-tab-item :label="$t('gallery')" value="items" class="p-5">
        <Gallery v-if="selectedTab === 'items'" />
      </o-tab-item>
    </o-tabs>
  </div>
</template>

<script setup lang="ts">
import { OTabItem, OTabs } from '@oruga-ui/oruga'

const { $store, $route, $router } = useNuxtApp()
const tabOrder = $store.state.preferences.exploreTabOrder

const selectedTab = computed({
  // getter
  get() {
    return $route.name?.split('-')[2] as string
  },
  // setter
  set(val) {
    $route.query.page = ''
    let queryOptions: {
      page: string
      search?: string | (string | null)[]
    } = {
      page: '1',
    }
    if ($route.query.search) {
      queryOptions.search = $route.query.search
    }

    $router.replace({
      path: val,
      query: queryOptions,
    })
  },
})
</script>
<style lang="scss">
@import '@/styles/abstracts/variables';

.explore-tabs {
  border: none;
  box-shadow: none;

  .o-tabs__nav {
    margin-bottom: 35px;
    max-width: 450px;
    box-shadow: $primary-shadow;
  }

  .o-tabs__nav-item-wrapper {
    width: 100%;
  }

  .o-tabs__nav-item {
    padding: 5px;
  }

  .explore-tabs-content {
    border: 0;
  }
}
</style>
