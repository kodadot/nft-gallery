<template>
  <div class="field has-addons is-flex is-align-items-center" data-cy="tabs">
    <div class="mr-4">
      <a
        class="is-hidden-mobile"
        :class="{ disabled: disabled }"
        @click="toggleSidebarFilters">
        <b-icon
          :icon="isSidebarFiltersOpen ? 'times' : 'bars'"
          size="is-medium" />
      </a>
      <a
        class="is-hidden-tablet"
        :class="{ disabled: disabled }"
        @click="openMobileFilters">
        <b-icon :icon="'bars'" size="is-medium" />
      </a>
    </div>

    <TabOnExplore />

    <!-- TODO: tabs for collection here -->
    <!-- <template v-if="route.name === 'prefix-collection-id'">
      <p class="control">
        <NeoButton
          class="explore-tabs-button"
          :active="route.name === 'prefix-collection-id'">
          <span>{{ $t('items') }}</span>
        </NeoButton>
      </p>
      <p class="control">
        <NeoButton class="explore-tabs-button">
          <span>{{ $t('tabs.activity') }}</span>
        </NeoButton>
      </p>
    </template>
    <template v-else>
      <p class="control">
        <NeoButton
          class="explore-tabs-button"
          tag="nuxt-link"
          :active="selectedTab === TabType.COLLECTION"
          to="collectibles">
          <span> {{ $t('collections') }}</span>
          <img v-if="selectedTab === TabType.COLLECTION" src="/checkmark.svg" />
        </NeoButton>
      </p>
      <p class="control">
        <NeoButton
          class="explore-tabs-button"
          tag="nuxt-link"
          :active="selectedTab === TabType.ITEMS"
          to="items">
          <span> {{ $t('items') }}</span>
          <img v-if="selectedTab === TabType.ITEMS" src="/checkmark.svg" />
        </NeoButton>
      </p>
    </template> -->
  </div>
</template>

<script setup lang="ts">
import TabOnExplore from './tab/TabOnExplore.vue'

const route = useRoute()
const { $store } = useNuxtApp()

const disabled = computed(() => {
  const allowedList = ['prefix-explore-items']

  return !allowedList.includes(route.name || '')
})

const isSidebarFiltersOpen = computed(
  () => $store.getters['preferences/getsidebarFilterCollapse']
)

const toggleSidebarFilters = () => {
  $store.dispatch(
    'preferences/setSidebarFilterCollapse',
    !isSidebarFiltersOpen.value
  )
}
const openMobileFilters = () => {
  $store.dispatch('preferences/setMobileFilterCollapse', true)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
a.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
