<template>
  <NeoSidebar
    fullheight
    fullwidth
    overlay
    position="fixed"
    :open="open"
    :can-cancel="['escape']"
    :on-cancel="onClose"
    class="top is-absolute background-color">
    <div class="is-flex is-flex-direction-column is-fullheight">
      <div class="is-flex-grow-1">
        <div class="is-flex border-bottom">
          <p class="card-header-title has-text-weight-bold">
            {{ $t('general.filters') }}
          </p>
          <a class="card-header-icon">
            <b-icon icon="x" @click.native="onClose" />
          </a>
        </div>
        <EventTypeFilter
          v-if="isCollectionActivityTab"
          data-model="store"
          expanded />
        <StatusFilter v-else data-model="store" expanded />
        <PriceFilter data-model="store" expanded />
      </div>

      <div class="buttons-container px-4 py-3 border-top">
        <NeoButton
          label="Reset All"
          variant="primary"
          class="is-flex-grow-1 mw-9 h-3_5 is-shadowless"
          @click.native="resetFilters">
          {{ $t('general.resetAll') }}
        </NeoButton>
        <NeoButton
          variant="k-accent"
          class="is-flex-grow-1 mw-9 h-3_5"
          @click.native="applyFilters">
          {{ $t('general.apply') }}
        </NeoButton>
      </div>
    </div>
  </NeoSidebar>
</template>

<script lang="ts" setup>
import { NeoButton, NeoSidebar } from '@kodadot1/brick'
import PriceFilter from './filters/PriceFilter.vue'
import StatusFilter from './filters/StatusFilter.vue'
import useReplaceUrl from './filters/useReplaceUrl'
import { useExploreFiltersStore } from '@/stores/exploreFilters'
import { useAcivityFiltersStore } from '@/stores/activityFilters'
import { usePreferencesStore } from '@/stores/preferences'
import EventTypeFilter from './filters/EventTypeFilter.vue'

const route = useRoute()
const preferencesStore = usePreferencesStore()
const exploreFiltersStore = useExploreFiltersStore()
const activityFiltersStore = useAcivityFiltersStore()

const isCollectionActivityTab = computed(
  () => route.name === 'prefix-collection-id-activity'
)
const { replaceUrl } = useReplaceUrl({
  resetPage: !isCollectionActivityTab.value,
})

const emit = defineEmits(['resetPage'])

const open = computed(() => preferencesStore.getMobileFilterCollapse)

const onClose = () => {
  syncFromUrl()
  closeFilterModal()
}

const closeFilterModal = () => preferencesStore.setMobileFilterCollapse(false)

const syncFromUrlOnActivityTab = () => {
  const sale = route.query?.sale?.toString() === 'true',
    offer = route.query?.offer?.toString() === 'true',
    listing = route.query?.listing?.toString() === 'true',
    mint = route.query?.mint?.toString() === 'true',
    transfer = route.query?.transfer?.toString() === 'true'

  activityFiltersStore.setSale(sale)
  activityFiltersStore.setOffer(offer)
  activityFiltersStore.setListing(listing)
  activityFiltersStore.setMint(mint)
  activityFiltersStore.setTransfer(transfer)
}
const syncFromUrlOnGrid = () => {
  const listed = route.query?.listed?.toString() === 'true',
    owned = route.query?.owned?.toString() === 'true'

  exploreFiltersStore.setListed(listed)
  exploreFiltersStore.setOwned(owned)
}

const syncFromUrl = () => {
  const min = Number(route.query?.min) || undefined,
    max = Number(route.query?.max) || undefined

  if (isCollectionActivityTab.value) {
    syncFromUrlOnActivityTab()
    activityFiltersStore.setPriceRange({ min, max })
  } else {
    syncFromUrlOnGrid
    exploreFiltersStore.setPriceRange({ min, max })
  }
}

const resetFilterOnAcivityTab = () => {
  const statusDefaults = {
    sale: false,
    offer: false,
    listing: false,
    mint: false,
    transfer: false,
  }

  const priceDefaults = {
    min: undefined,
    max: undefined,
  }
  activityFiltersStore.setSale(statusDefaults.sale)
  activityFiltersStore.setOffer(statusDefaults.offer)
  activityFiltersStore.setListing(statusDefaults.listing)
  activityFiltersStore.setMint(statusDefaults.mint)
  activityFiltersStore.setTransfer(statusDefaults.transfer)

  activityFiltersStore.setPriceRange(priceDefaults)
  replaceUrl({
    ...statusDefaults,
    ...priceDefaults,
  })
}
const resetFilters = () => {
  if (isCollectionActivityTab) {
    resetFilterOnAcivityTab
  } else {
    const statusDefaults = {
      listed: false,
      owned: false,
    }

    exploreFiltersStore.setListed(statusDefaults.listed)
    exploreFiltersStore.setOwned(statusDefaults.owned)

    // price
    const priceDefaults = {
      min: undefined,
      max: undefined,
    }
    exploreFiltersStore.setPriceRange(priceDefaults)

    replaceUrl({
      ...statusDefaults,
      ...priceDefaults,
    })
  }

  emit('resetPage')
  closeFilterModal()
}

const applyFilters = () => {
  // status filters
  const statusFilters = exploreFiltersStore.getStatusFilters
  const priceRangeFilter = exploreFiltersStore.getPriceRange
  const eventTypeFilter = activityFiltersStore.getEventTypeFilters

  // apply to URL
  if (isCollectionActivityTab.value) {
    replaceUrl({ ...eventTypeFilter, ...priceRangeFilter })
  } else {
    replaceUrl({ ...statusFilters, ...priceRangeFilter })
  }
  emit('resetPage')
  closeFilterModal()
}

watch(() => route.query, syncFromUrl, { immediate: true })
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.is-fullheight {
  height: 100%;
}
.is-absolute {
  position: absolute;
}
.buttons-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.top {
  z-index: 1000;
}
.h-3_5 {
  height: 3.5rem !important;
}
.mw-9 {
  min-width: 9rem;
}
</style>

<style lang="scss">
@import '@/styles/abstracts/variables';
.background-color .o-side {
  &__content {
    @include ktheme() {
      background-color: theme('background-color');
    }
  }
  &__overlay {
    @include ktheme() {
      background-color: theme('background-color');
      opacity: 0.86;
    }
  }
}
</style>
