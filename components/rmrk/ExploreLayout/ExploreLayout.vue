<template>
  <div>
    <div v-if="$route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ $route.query.search }}</span>
    </div>
    <CollectionList v-if="selectedTab === tabType.COLLECTION" />
    <Gallery v-if="selectedTab === tabType.ITEMS" />
  </div>
</template>

<script setup lang="ts">
enum tabType {
  COLLECTION = 'collectibles',
  ITEMS = 'items',
}

const { $route, $router } = useNuxtApp()
let selectedTab = ref($route.name?.split('-')[2])
</script>
