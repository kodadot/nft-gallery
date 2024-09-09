<template>
  <div>
    <div class="flex justify-between py-5 content-center">
      <div class="flex !gap-4 items-center flex-wrap">
        <NeoButton
          v-for="filter in filters"
          :key="filter.id"
          :active="filter.active"
          variant="outlined-rounded"
          data-testid="profile-activity-button-filter"
          class="capitalize"
          :icon-left="filter.icon"
          @click="filter.active = !filter.active"
        >
          <div class="flex gap-2">
            <span>{{ filter.id }}</span>
            <span
              v-if="offerIds?.[filter.id].length"
              class="text-k-grey"
            >
              ({{ offerIds[filter.id].length || '' }})
            </span>
          </div>
        </NeoButton>
      </div>
    </div>

    <hr class="mb-10 mt-0">

    <div>
      <ResponsiveTable
        :no-results-main="$t('activity.noResults')"
        :no-results-sub="$t('activity.noResultsSub')"
        :items="offers"
        :show-no-results="(!offers.length || !activeFilters.length) && !loading"
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
import { NeoButton } from '@kodadot1/brick'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const selectedOffer = ref<NFTOfferItem>()
const isOfferModalOpen = ref(false)
const offerIds = ref<{ incoming: string[], outgoing: string[] }>()

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
const isIncomingActive = computed(() => activeFilters.value.includes('incoming'))
const isOutgoingActive = computed(() => activeFilters.value.includes('outgoing'))
const loading = computed(() => loadingOffers.value || !offerIds.value)

if (!activeFilters.value.length) {
  filters.value = filters.value.map(filter => filter.id === 'outgoing' ? ({ ...filter, active: true }) : filter)
}

const where = computed(() => {
  if (!offerIds.value) {
    return {}
  }

  const id_in = [] as string[][]

  if (isOutgoingActive.value) {
    id_in.push(offerIds.value.outgoing)
  }

  if (isIncomingActive.value) {
    id_in.push(offerIds.value.incoming)
  }

  return { id_in: id_in.flat() }
})

const { offers, loading: loadingOffers, refetch } = useOffers({ where, disabled: computed(() => !activeFilters.value.length || !offerIds.value) })

watch(syncQuery, () => {
  replaceUrl(syncQuery.value)
}, { immediate: true })

useSubscriptionGraphql({
  query: `
    incoming: offers (
      where: { status_eq: ACTIVE, desired: { currentOwner_eq: "${props.id}" } }
      orderBy: blockNumber_DESC
    ) {
      id
    }
    outgoing: offers (
      where: { status_in: [ACTIVE, EXPIRED], caller_eq: "${props.id}" }
      orderBy: blockNumber_DESC
    ) {
      id
    }
  `,
  onChange: ({ data }) => {
    if (offerIds.value && (
      (isIncomingActive.value && offerIds.value.incoming.length !== data.incoming.length)
      || (isOutgoingActive.value && offerIds.value.outgoing.length !== data.outgoing.length))
    ) {
      refetch({ where: where.value })
    }

    offerIds.value = {
      incoming: data.incoming.map(o => o.id),
      outgoing: data.outgoing.map(o => o.id),
    }
  },
})
</script>
