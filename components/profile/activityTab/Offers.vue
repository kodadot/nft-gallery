<template>
  <div>
    <div class="flex justify-between py-5 content-center">
      <div class="flex !gap-4 items-center flex-wrap">
        <FilterButton
          v-for="({ id, icon }) in filters"
          :key="id"
          variant="outlined-rounded"
          data-testid="profile-activity-button-filter"
          class="capitalize"
          :icon-left="icon"
          :url-param="id"
        >
          <div class="flex gap-2">
            <span>{{ id }}</span>
            <span
              v-if="counts?.[id]"
              class="text-k-grey"
            >
              ({{ counts[id] || '' }})
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
        :show-no-results="!offers.length"
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

const filters = [{
  id: 'outgoing',
  icon: 'arrow-up',
}, {
  id: 'incoming',
  icon: 'arrow-down',
}]

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const selectedOffer = ref<NFTOfferItem>()
const isOfferModalOpen = ref(false)

const activeFilters = computed(() =>
  filters.filter(queryParam => route.query[queryParam.id] === 'true').map(filter => filter.id),
)

const isIncomingActive = computed(() => activeFilters.value.includes('incoming'))
const isOutgoingActive = computed(() => activeFilters.value.includes('outgoing'))

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

  if (isOutgoingActive.value) {
    conditions.push(outgoing)
  }

  if (isIncomingActive.value) {
    conditions.push(incoming)
  }

  // if non selected empty results
  return isOutgoingActive.value || isIncomingActive.value ? { OR: conditions } : { AND: [outgoing, incoming] }
})

const { offers, loading } = useOffers({ where })

const counts = ref<{ incoming: number, outgoing: number }>()

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

onMounted(() => {
  const noFiltersActive = activeFilters.value.length === 0
  if (noFiltersActive) {
    replaceUrl({
      outgoing: 'true',
    })
  }
})
</script>
