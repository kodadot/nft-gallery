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
        <div class="border-bottom">
          <StatusFilter data-model="store" expanded />
        </div>
        <div class="border-bottom">
          <PriceFilter data-model="store" expanded />
        </div>
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
import { usePreferencesStore } from '@/stores/preferences'

const route = useRoute()
const preferencesStore = usePreferencesStore()
const exploreFiltersStore = useExploreFiltersStore()
const { replaceUrl } = useReplaceUrl()

const emit = defineEmits(['resetPage'])

const open = computed(() => preferencesStore.getMobileFilterCollapse)

const onClose = () => {
  syncFromUrl()
  closeFilterModal()
}

const closeFilterModal = () => preferencesStore.setMobileFilterCollapse(false)

const syncFromUrl = () => {
  const listed = route.query?.listed?.toString() === 'true',
    owned = route.query?.owned?.toString() === 'true',
    min = Number(route.query?.min) || undefined,
    max = Number(route.query?.max) || undefined

  exploreFiltersStore.setListed(listed)
  exploreFiltersStore.setOwned(owned)
  exploreFiltersStore.setPriceRange({ min, max })
}

// TODO: move this to pinia
const resetFilters = () => {
  // set store to defaults
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
  emit('resetPage')
  closeFilterModal()
}

const applyFilters = () => {
  // status filters
  const statusFilters = exploreFiltersStore.getStatusFilters
  const priceRangeFilter = exploreFiltersStore.getPriceRange

  // apply to URL
  replaceUrl({ ...statusFilters, ...priceRangeFilter })
  emit('resetPage')
  closeFilterModal()
}

watch(() => route.query, syncFromUrl)
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

.border-bottom {
  @include ktheme() {
    border-bottom: 1px solid theme('border-color');
  }
}
.border-top {
  @include ktheme() {
    border-top: 1px solid theme('border-color');
  }
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
