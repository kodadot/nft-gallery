<template>
  <div class="section pb-0">
    <h1 class="title container">{{ $t('explore') }}</h1>
    <div v-if="route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ route.query.search }}</span>
    </div>

    <div class="mb-5 explore-tabs container is-flex" data-cy="tabs">
      <p>
        <NeoButton
          class="btn-collection"
          :selected="selectedTab === TabType.COLLECTION"
          :label="$t('collections')"
          @click.native="updateTab(TabType.COLLECTION)" />
      </p>
      <p>
        <NeoButton
          class="btn-items"
          :selected="selectedTab === TabType.ITEMS"
          :label="$t('items')"
          @click.native="updateTab(TabType.ITEMS)" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts" scoped>
import { NeoButton } from '@kodadot1/brick'
enum TabType {
  COLLECTION = 'collectibles',
  ITEMS = 'items',
}

const route = useRoute()
const router = useRouter()

const selectedTab = computed(() => route?.name?.split('-')[2])

const updateTab = (val) => {
  route.query.page = ''
  let queryOptions: {
    page: string
    search?: string | (string | null)[]
  } = {
    page: '1',
  }
  if (route.query.search) {
    queryOptions.search = route.query.search
  }
  router.replace({
    path: val,
    query: queryOptions,
  })
}
</script>

<style lang="scss">
.explore-heading {
  font-weight: 700;
}

.explore-tabs {
  .btn-items {
    width: 240px;
    border-left: none;
  }

  .btn-collection {
    width: 240px;
  }
}
</style>
