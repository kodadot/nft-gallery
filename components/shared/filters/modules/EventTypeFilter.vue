<template>
  <NeoCollapse
    :open="expanded"
    animation="slide"
    class="border-b"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="flex" role="button" :aria-expanded="open">
        <p class="card-header-title font-normal">Event Type</p>
        <a class="card-header-icon">
          <NeoIcon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div class="p-4">
      <NeoField>
        <NeoCheckbox v-model="sale" data-testid="event-checkbox-filter-sale">{{
          $t('filters.sale')
        }}</NeoCheckbox>
      </NeoField>
      <NeoField>
        <NeoCheckbox
          v-model="listing"
          data-testid="event-checkbox-filter-listing"
          >{{ $t('filters.listing') }}</NeoCheckbox
        >
      </NeoField>
      <NeoField>
        <NeoCheckbox v-model="mint" data-testid="event-checkbox-filter-mint">{{
          $t('filters.mint')
        }}</NeoCheckbox>
      </NeoField>
      <NeoField>
        <NeoCheckbox
          v-model="transfer"
          data-testid="event-checkbox-filter-transfer"
          >{{ $t('filters.transfer') }}</NeoCheckbox
        >
      </NeoField>
    </div>
  </NeoCollapse>
</template>

<script lang="ts" setup>
import { useAcivityFiltersStore } from '@/stores/activityFilters'
import { NeoCheckbox, NeoCollapse, NeoField, NeoIcon } from '@kodadot1/brick'

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
  },
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
