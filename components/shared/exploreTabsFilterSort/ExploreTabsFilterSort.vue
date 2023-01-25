<template>
  <div>
    <div v-if="route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ route.query.search }}</span>
    </div>

    <div
      class="mb-5 explore-tabs field has-addons is-flex is-align-items-center"
      data-cy="tabs">
      <div class="mr-4">
        <a
          :class="{ disabled: selectedTab === TabType.COLLECTION }"
          @click="toggleSidebarfilter">
          <b-icon :icon="isSidebarOpen ? 'times' : 'bars'" size="is-medium" />
        </a>
      </div>
      <p class="control">
        <NeoButton
          class="explore-tabs-button"
          :active="selectedTab === TabType.COLLECTION"
          @click.native="updateTab(TabType.COLLECTION)">
          <span> {{ $t('collections') }}</span>
          <img
            v-if="selectedTab === TabType.COLLECTION"
            src="/checkmark.svg"
            class="check-icon" />
        </NeoButton>
      </p>
      <p class="control">
        <NeoButton
          class="explore-tabs-button"
          :active="selectedTab === TabType.ITEMS"
          @click.native="updateTab(TabType.ITEMS)">
          <span> {{ $t('items') }}</span>
          <img
            v-if="selectedTab === TabType.ITEMS"
            src="/checkmark.svg"
            class="check-icon" />
        </NeoButton>
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
const { $store } = useNuxtApp()

const selectedTab = computed(() => route?.name?.split('-')[2])

const isSidebarOpen = computed(
  () => $store.getters['preferences/getSidebarfilterCollapse']
)
const toggleSidebarfilter = () =>
  $store.dispatch('preferences/setSidebarfilterCollapse', !isSidebarOpen.value)

const updateTab = (val) => {
  route.query.page = ''
  let queryOptions: {
    page: string
    search?: string | (string | null)[]
  } = {
    page: '1',
  }
  if (val === TabType.COLLECTION) {
    $store.dispatch('preferences/setSidebarfilterCollapse', false)
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

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

a.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}
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

.dark-mode .explore-tabs-button.active img {
  filter: brightness(0%);
}
</style>
