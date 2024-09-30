<template>
  <div>
    <div class="flex justify-between py-5 content-center">
      <div class="flex !gap-4 items-center flex-wrap">
        <NeoButton
          v-for="filter in tabs"
          :key="filter.id"
          :active="filter.id === activeTab"
          variant="outlined-rounded"
          data-testid="profile-activity-button-filter"
          class="capitalize"
          :icon-left="filter.icon"
          @click="activeTab = filter.id"
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
        :show-no-results="!offers.length && !loading"
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
            <span> {{ $t(`activity.event.${tabTarget}`) }} </span>
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
            :target="tabTarget"
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

type OfferTabType = 'outgoing' | 'incoming'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const selectedOffer = ref<NFTOfferItem>()
const isOfferModalOpen = ref(false)
const offerIds = ref<{ incoming: string[], outgoing: string[] }>()

const tabs = ref([{
  id: 'outgoing' as OfferTabType,
  icon: 'arrow-up',
}, {
  id: 'incoming' as OfferTabType,
  icon: 'arrow-down',
}])

const activeTab = ref<OfferTabType>(route.query.filter?.toString() as OfferTabType || 'outgoing')
const tabTarget = computed(() => activeTab.value === 'outgoing' ? 'to' : 'from')
const isIncomingActive = computed(() => activeTab.value === 'incoming')
const isOutgoingActive = computed(() => activeTab.value === 'outgoing')
const loading = computed(() => loadingOffers.value || !offerIds.value)

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

const { offers, loading: loadingOffers, refetch } = useOffers({ where, disabled: computed(() => !offerIds.value) })

watch(activeTab, (newVal) => {
  replaceUrl({ filter: newVal })
})

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
