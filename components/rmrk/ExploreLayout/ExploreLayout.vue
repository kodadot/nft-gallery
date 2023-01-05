<template>
  <div>
    <div v-if="$route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ $route.query.search }}</span>
    </div>
    <NeoTab
      :model-value="selectedTab"
      data-cy="tabs"
      class="explore-tabs"
      content-class="explore-tabs-content"
      @update:modelValue="updateTab($event)">
      <template #items>
        <NeoTabItem :label="$t('collections')" value="collectibles">
          <CollectionList />
        </NeoTabItem>

        <NeoTabItem :label="$t('gallery')" value="items" class="p-5">
          <Gallery />
        </NeoTabItem>
      </template>
    </NeoTab>
  </div>
</template>

<script setup lang="ts">
import { NeoTab, NeoTabItem } from '@kodadot1/brick'
const { $route, $router } = useNuxtApp()
const selectedTab = ref($route.name?.split('-')[2])

const updateTab = (val) => {
  $route.query.page = ''
  let queryOptions: {
    page: string
    search?: string | (string | null)[]
  } = {
    page: '1',
  }

  history.pushState({}, '', val)
}
</script>
<style lang="scss">
.explore-tabs {
  border: none;
  box-shadow: none;

  .explore-tabs-content {
    border: 0;
  }
}
</style>
