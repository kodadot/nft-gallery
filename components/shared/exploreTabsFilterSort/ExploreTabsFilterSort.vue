<template>
  <div>
    <div v-if="route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ route.query.search }}</span>
    </div>

    <div class="mb-5 explore-tabs field has-addons is-flex" data-cy="tabs">
      <p class="control">
        <NeoButton
          class="explore-tabs-button"
          :active="selectedTab === TabType.COLLECTION"
          :icon="checkIcon(TabType.COLLECTION)"
          :label="`${$t('collections')}`"
          @click.native="updateTab(TabType.COLLECTION)" />
      </p>
      <p class="control">
        <NeoButton
          class="explore-tabs-button"
          :active="selectedTab === TabType.ITEMS"
          :icon="checkIcon(TabType.ITEMS)"
          :label="`${$t('items')}`"
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
const checkIcon = (tab) => {
  return selectedTab.value === tab ? 'check' : ''
}

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
@import '@/styles/abstracts/variables';

.explore-tabs {
  &-button {
    width: 15rem;
  }

  @include mobile {
    .control,
    &-button {
      width: 100%;
    }
  }
}
</style>
