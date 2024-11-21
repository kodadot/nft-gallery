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
              v-if="tradeIds?.[filter.id].length"
              class="text-k-grey"
            >
              ({{ tradeIds[filter.id].length || '' }})
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
        :items="trades"
        :show-no-results="!trades.length && !loading"
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
            <span>{{ $t('expiration') }}</span>
          </div>
          <div class="flex-1">
            <span />
          </div>
        </template>

        <template #rows="{ variant }">
          <ProfileActivityTabTradeRow
            v-for="item in trades"
            :key="item.id"
            data-testid="offer-item-row"
            :offer="item"
            :target="tabTarget"
            :variant="variant"
            @select="() => {
              selectedTrade = item
              isTradeModalOpen = true
            }"
          />
        </template>
      </ResponsiveTable>
    </div>
  </div>

  <TradeOverviewModal
    v-model="isTradeModalOpen"
    :trade="selectedTrade"
    @close="() => {
      selectedTrade = undefined
      isTradeModalOpen = false
    }"
  />
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

type TradeTabType = 'outgoing' | 'incoming'

const props = defineProps<{
  id: string
  type: TradeType
}>()

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const dataKey = TRADES_QUERY_MAP[props.type].dataKey

const selectedTrade = ref<TradeNftItem>()
const isTradeModalOpen = ref(false)
const tradeIds = ref<{ incoming: string[], outgoing: string[] }>()
const activeTab = ref<TradeTabType>(route.query.filter?.toString() as TradeTabType || 'outgoing')

const tabs = ref([{
  id: 'outgoing' as TradeTabType,
  icon: 'arrow-up',
}, {
  id: 'incoming' as TradeTabType,
  icon: 'arrow-down',
}])

const tabTarget = computed(() => activeTab.value === 'outgoing' ? 'to' : 'from')
const isIncomingActive = computed(() => activeTab.value === 'incoming')
const isOutgoingActive = computed(() => activeTab.value === 'outgoing')
const loading = computed(() => loadingTrades.value || !tradeIds.value)

const where = computed(() => {
  if (!tradeIds.value) {
    return {}
  }

  const id_in = [] as string[][]

  if (isOutgoingActive.value) {
    id_in.push(tradeIds.value.outgoing)
  }

  if (isIncomingActive.value) {
    id_in.push(tradeIds.value.incoming)
  }

  return { id_in: id_in.flat() }
})

const { items: trades, loading: loadingTrades, refetch } = useTrades({ where, disabled: computed(() => !tradeIds.value), type: props.type })

watch(activeTab, value => replaceUrl({ filter: value }))

useSubscriptionGraphql({
  query: `
    incoming: ${dataKey} (
      where: { status_eq: ACTIVE, desired: { currentOwner_eq: "${props.id}" } }
      orderBy: blockNumber_DESC
    ) {
      id
    }
    outgoing: ${dataKey} (
      where: { status_in: [ACTIVE, EXPIRED], caller_eq: "${props.id}" }
      orderBy: blockNumber_DESC
    ) {
      id
    }
  `,
  onChange: ({ data }) => {
    if (tradeIds.value && (
      (isIncomingActive.value && tradeIds.value.incoming.length !== data.incoming.length)
      || (isOutgoingActive.value && tradeIds.value.outgoing.length !== data.outgoing.length))
    ) {
      refetch({ where: where.value })
    }

    tradeIds.value = {
      incoming: data.incoming.map(item => item.id),
      outgoing: data.outgoing.map(item => item.id),
    }
  },
})
</script>
