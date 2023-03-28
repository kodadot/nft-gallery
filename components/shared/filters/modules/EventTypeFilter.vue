<template>
  <b-collapse
    :open="expanded"
    animation="slide"
    class="border-bottom"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="is-flex" role="button" :aria-expanded="open">
        <p class="card-header-title has-text-weight-normal">Event Type</p>
        <a class="card-header-icon">
          <b-icon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div class="p-4">
      <b-field>
        <NeoCheckbox v-model="sale">{{ $t('filters.sale') }}</NeoCheckbox>
      </b-field>
      <b-field>
        <NeoCheckbox v-model="offer">{{ $t('filters.offer') }}</NeoCheckbox>
      </b-field>
      <b-field>
        <NeoCheckbox v-model="listing">{{ $t('filters.listing') }}</NeoCheckbox>
      </b-field>
      <b-field>
        <NeoCheckbox v-model="mint">{{ $t('filters.mint') }}</NeoCheckbox>
      </b-field>
      <b-field>
        <NeoCheckbox v-model="transfer">{{
          $t('filters.transfer')
        }}</NeoCheckbox>
      </b-field>
    </div>
  </b-collapse>
</template>

<script lang="ts" setup>
import useReplaceUrl from '@/composables/useReplaceUrl'
import { NeoCheckbox } from '@kodadot1/brick'
import { useAcivityFiltersStore } from '@/stores/activityFilters'

const activityFiltersStore = useAcivityFiltersStore()
const route = useRoute()
const { replaceUrl: replaceURL } = useReplaceUrl({ resetPage: false })

type DataModel = 'query' | 'store'

const props = withDefaults(
  defineProps<{
    expanded?: boolean
    dataModel?: DataModel
    fluidPadding?: boolean
  }>(),
  {
    expanded: false,
    dataModel: 'query',
    fluidPadding: false,
  }
)

const emit = defineEmits(['resetPage'])

const sale =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.sale?.toString() === 'true',
        set: (value) => applyToUrl({ sale: String(value) }),
      })
    : computed({
        get: () => activityFiltersStore.getEventTypeFilters.sale,
        set: (value) => activityFiltersStore.setSale(value),
      })

const offer =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.offer?.toString() === 'true',
        set: (value) => applyToUrl({ offer: String(value) }),
      })
    : computed({
        get: () => activityFiltersStore.getEventTypeFilters.offer,
        set: (value) => activityFiltersStore.setOffer(value),
      })

const listing =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.listing?.toString() === 'true',
        set: (value) => applyToUrl({ listing: String(value) }),
      })
    : computed({
        get: () => activityFiltersStore.getEventTypeFilters.listing,
        set: (value) => activityFiltersStore.setListing(value),
      })

const mint =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.mint?.toString() === 'true',
        set: (value) => applyToUrl({ mint: String(value) }),
      })
    : computed({
        get: () => activityFiltersStore.getEventTypeFilters.mint,
        set: (value) => activityFiltersStore.setMint(value),
      })

const transfer =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.transfer?.toString() === 'true',
        set: (value) => applyToUrl({ transfer: String(value) }),
      })
    : computed({
        get: () => activityFiltersStore.getEventTypeFilters.transfer,
        set: (value) => activityFiltersStore.setTransfer(value),
      })

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
