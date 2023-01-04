<template>
  <div>
    <div v-if="$route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ $route.query.search }}</span>
    </div>
    <NeoTab
      :v-model="selectedTab"
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
let selectedTab

// const selectedTab = computed({
//   // getter
//   get() {
//     console.log('helllo')
//     return $route.name?.split('-')[2] as string
//   },
//   // setter
//   set(val) {
//     console.log('helllo2', $route.query.page)

//     $route.query.page = ''
//     let queryOptions: {
//       page: string
//       search?: string | (string | null)[]
//     } = {
//       page: '1',
//     }
//     if ($route.query.search) {
//       queryOptions.search = $route.query.search
//     }

//     $router.replace({
//       path: val,
//       query: queryOptions,
//     })
//   },
// })

const updateTab = (val) => {
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
  border: none;
  box-shadow: none;

  .explore-tabs-content {
    border: 0;
  }
}
</style>
