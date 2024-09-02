<template>
  <div>
    <div class="flex justify-between py-5 content-center">
      <div class="flex !gap-4 items-center flex-wrap">
        <FilterButton
          v-for="filter in filters"
          :key="filter.id"
          v-model="filter.active"
          variant="outlined-rounded"
          data-testid="profile-activity-button-filter"
          class="capitalize"
          :icon-left="filter.icon"
          :url-param="filter.id"
        >
          <div class="flex gap-2">
            <span>{{ filter.id }}</span>
            <span
              v-if="counts?.[filter.id]"
              class="text-k-grey"
            >
              ({{ counts[filter.id] || '' }})
            </span>
          </div>
        </FilterButton>
      </div>
    </div>

    <hr class="mb-10 mt-0">

    <div>
      <ResponsiveTable
        :no-results-main="$t('activity.noResults')"
        :no-results-sub="$t('activity.noResultsSub')"
        :items="offers"
        :show-no-results="!offers.length || !activeFilters.length"
        :loading="loading"
      >
        <template #columns>
          <div class="flex-1">
            <span>{{ $t('activity.event.item') }}</span>
          </div>
          <div class="w-1/12">
            <span>{{ $t('activity.event.event') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.amount') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.to') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.time') }}</span>
          </div>
          <div class="flex-1">
            <span />
          </div>
        </template>

        <template #rows="{ variant }">
          <ProfileActivityTabOfferRow
            v-for="item in offers"
            :key="item.id"
            data-testid="offer-item-row"
            :offer="item"
            :variant="variant as unknown"
            @select="() => {
              selectedOffer = item
              isOfferModalOpen = true
            }"
          />
        </template>
      </ResponsiveTable>
    </div>
  </div>

  <OfferOverviewModal
    v-model="isOfferModalOpen"
    :offer="selectedOffer"
    @close="() => {
      selectedOffer = undefined
      isOfferModalOpen = false
    }"
  />
</template>

<script lang="ts" setup>
import FilterButton from '@/components/profile/FilterButton.vue'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const selectedOffer = ref<NFTOfferItem>()
const isOfferModalOpen = ref(false)
const counts = ref<{ incoming: number, outgoing: number }>()

const toBoolean = (param: unknown): boolean => param === 'true'

const filters = ref([{
  id: 'outgoing',
  icon: 'arrow-up',
  active: toBoolean(route.query.outgoing),
}, {
  id: 'incoming',
  icon: 'arrow-down',
  active: toBoolean(route.query.incoming),
}])

const syncQuery = computed(() => Object.fromEntries(filters.value.map(filter => [filter.id, filter.active])))
const activeFilters = computed(() => Object.keys(syncQuery.value).filter(queryKey => syncQuery.value[queryKey]))

if (!activeFilters.value.length) {
  filters.value = filters.value.map(filter => filter.id === 'outgoing' ? ({ ...filter, active: true }) : filter)
}

const where = computed(() => {
  const conditions = [] as Record<string, unknown>[]

  const outgoing = {
    caller_eq: props.id,
    status_eq: 'ACTIVE',
  }

  const incoming = {
    desired: { currentOwner_eq: props.id },
    status_eq: 'ACTIVE',
  }

  if (activeFilters.value.includes('outgoing')) {
    conditions.push(outgoing)
  }

  if (activeFilters.value.includes('incoming')) {
    conditions.push(incoming)
  }

  return { OR: conditions }
})

const { offers, loading } = useOffers({ where, disabled: computed(() => !activeFilters.value.length) })

watch(syncQuery, () => {
  replaceUrl(syncQuery.value)
}, { immediate: true })

useSubscriptionGraphql({
  query: `
    incoming: offersConnection (
      where: { status_eq: ACTIVE, desired: { currentOwner_eq: "${props.id}" } }
      orderBy: blockNumber_DESC
    ) {
      totalCount
    }
    outgoing: offersConnection (
      where: { status_eq: ACTIVE, caller_eq: "${props.id}" }
      orderBy: blockNumber_DESC
    ) {
      totalCount
    }
  `,
  onChange: ({ data }) => {
    counts.value = {
      incoming: data.incoming.totalCount,
      outgoing: data.outgoing.totalCount,
    }
  },
})
</script>
