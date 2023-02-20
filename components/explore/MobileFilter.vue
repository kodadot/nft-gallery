<template>
  <b-modal
    v-if="isMobile"
    :active="open"
    :on-cancel="closeFilterModal"
    :can-cancel="['escape']"
    class="top no-border"
    full-screen>
    <div class="is-flex is-flex-direction-column is-fullheight is-fullwidth">
      <div class="is-flex-grow-1">
        <div class="is-flex border-bottom">
          <p class="card-header-title has-text-weight-normal">
            {{ $t('general.filters') }}
          </p>
          <a class="card-header-icon">
            <b-icon icon="x" @click.native="closeFilterModal" />
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
          class="is-fullwidth mw-9 h-3_5"
          @click.native="resetFilters">
          {{ $t('general.resetAll') }}
        </NeoButton>
        <NeoButton
          variant="k-accent"
          class="is-fullwidth mw-9 h-3_5"
          @click.native="applyFilters">
          {{ $t('general.apply') }}
        </NeoButton>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import PriceFilter from './filters/PriceFilter.vue'
import StatusFilter from './filters/StatusFilter.vue'
import useReplaceUrl from './filters/useReplaceUrl'
const route = useRoute()

const { $store } = useNuxtApp()
const { replaceUrl } = useReplaceUrl()
const width = ref(window.innerWidth)

onMounted(() => {
  window.addEventListener('resize', () => {
    width.value = window.innerWidth
  })
  readFiltersFromUrl()
})

const emit = defineEmits(['resetPage'])

const isMobile = computed(() => width.value <= 768)

const open = computed(
  () => $store.getters['preferences/getMobileFilterCollapse']
)

const closeFilterModal = () => {
  $store.dispatch('preferences/setMobileFilterCollapse', false)
}

const readFiltersFromUrl = () => {
  const listed = route.query?.listed?.toString() === 'true',
    owned = route.query?.owned?.toString() === 'true',
    min = Number(route.query?.min) || undefined,
    max = Number(route.query?.max) || undefined

  $store.dispatch('exploreFilters/setListed', listed)
  $store.dispatch('exploreFilters/setOwned', owned)
  $store.dispatch('exploreFilters/setPriceRange', { min, max })
}

const resetFilters = () => {
  // set store to defaults
  const statusDefaults = {
    listed: false,
    owned: false,
  }
  $store.dispatch('exploreFilters/setListed', statusDefaults.listed)
  $store.dispatch('exploreFilters/setOwned', statusDefaults.owned)
  // price
  const priceDefaults = {
    min: undefined,
    max: undefined,
  }
  $store.dispatch('exploreFilters/setPriceRange', priceDefaults)

  replaceUrl({
    ...statusDefaults,
    ...priceDefaults,
  })
  emit('resetPage')
  closeFilterModal()
}

const applyFilters = () => {
  // status filters
  const statusFilters = $store.getters['exploreFilters/getStatusFilters']
  const priceRangeFilter = $store.getters['exploreFilters/getPriceRange']

  // apply to URL
  replaceUrl({ ...statusFilters, ...priceRangeFilter })
  emit('resetPage')
  closeFilterModal()
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.is-fullwidth {
  width: 100%;
}
.is-fullheight {
  height: 100%;
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
.no-border {
  > .modal-content {
    border: none !important;
    box-shadow: none !important;
  }
}

.modal-content {
  @include ktheme() {
    background-color: theme('background-color') !important;
  }
}
</style>
