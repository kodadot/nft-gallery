<template>
  <div>
    <div class="flex justify-between py-5 content-center">
      <div class="flex !gap-4 items-center flex-wrap">
        <NeoButton
          v-for="filter in tabs"
          :key="filter.id"
          :active="filter.id === activeTab"
          variant="outlined-rounded"
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
          <template v-if="isSwap(type)">
            <div class="flex-1">
              <span>{{ $t('trades.youOffer') }}</span>
            </div>
            <div class="flex-1 max-w-10">
              <span />
            </div>
            <div class="flex-1">
              <span>{{ $t('trades.youGet') }}</span>
            </div>
          </template>
          <template v-else>
            <div class="flex-1">
              <span>{{ $t('activity.event.item') }}</span>
            </div>
            <div class="flex-1">
              <span>{{ $t('activity.event.amount') }}</span>
            </div>
          </template>
          <div class="flex-1">
            <span> {{ $t(`swap.counterparty`) }} </span>
          </div>
          <div class="flex-1">
            <span />
          </div>
          <div class="flex-1">
            <span>{{ $t('expiration') }}</span>
          </div>
          <div class="flex-1">
            <span />
          </div>
        </template>

        <template #rows="{ variant }">
          <TradeActivityTableRow
            v-for="item in trades"
            :key="item.id"
            data-testid="offer-item-row"
            :trade="item"
            :target="tabTarget"
            :variant="variant"
            @counter-swap="() => onCounterSwapClick(item)"
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
import type {
  TradeType,
  Swap,
  TradeNftItem,
} from '@/components/trade/types'

type TradeTabType = 'outgoing' | 'incoming'
export type TradeTableQuery = Record<TradeTabType, string>

const props = defineProps<{
  type: TradeType
  query: TradeTableQuery
}>()

const route = useRoute()
const swapStore = useAtomicSwapStore()
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

const { items: trades, loading: loadingTrades } = useTrades({ where, disabled: computed(() => !Object.keys(where.value).length), type: props.type })

const onCounterSwapClick = (trade: TradeNftItem) => {
  if (!trade.desired) {
    return
  }

  const withFields: CrateSwapWithFields = {
    desired: [tradeToSwapItem(trade.offered)],
    offered: [tradeToSwapItem(trade.desired)],
  }

  const tSwap = trade as TradeNftItem<Swap>

  if (tSwap.surcharge) {
    Object.assign(withFields, {
      surcharge: {
        amount: tSwap.price,
        direction: tSwap.surcharge,
      },
    })
  }

  const swap = swapStore.createSwap(trade.caller, withFields)

  navigateToSwap(swap)
}

watch(activeTab, value => replaceUrl({ filter: value }))

useSubscriptionGraphql({
  query: `
    incoming: ${dataKey} (
      where: ${props.query.incoming}
      orderBy: blockNumber_DESC
    ) {
      id
    }
    outgoing: ${dataKey} (
      where: ${props.query.outgoing}
      orderBy: blockNumber_DESC
    ) {
      id
    }
  `,
  onChange: ({ data }) => {
    tradeIds.value = {
      incoming: data.incoming.map(item => item.id),
      outgoing: data.outgoing.map(item => item.id),
    }
  },
})
</script>
