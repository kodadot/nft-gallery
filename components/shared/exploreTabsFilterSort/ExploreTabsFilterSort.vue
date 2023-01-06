<template>
  <div class="section pb-0">
    <div v-if="$route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ $route.query.search }}</span>
    </div>
    <div class="mb-5 explore-tabs container">
      <NeoButton
        class="btn-collection"
        :selected="selectedTab === tabType.COLLECTION"
        :label="$t('collections')"
        @click.native="updateTab(tabType.COLLECTION)" />
      <NeoButton
        class="btn-items"
        :selected="selectedTab === tabType.ITEMS"
        :label="$t('items')"
        @click.native="updateTab(tabType.ITEMS)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

enum tabType {
  COLLECTION = 'collectibles',
  ITEMS = 'items',
}

const { $route, $router } = useNuxtApp()
let selectedTab = ref($route.name?.split('-')[2])

const updateTab = (val) => {
  selectedTab.value = val
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
}
</script>

<style lang="scss">
.explore-tabs {
  .btn-items {
    width: 240px;
    left: -6px;
    border-left: none;
  }

  .btn-collection {
    width: 240px;
  }
}
</style>
