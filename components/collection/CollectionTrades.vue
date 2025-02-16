<template>
  <div class="flex">
    <SidebarFilter />

    <div
      ref="wrapper"
      class="w-full !my-4"
    >
      <BreadcrumbsFilter class="max-md:hidden" />

      <TradeActivityTable
        :key="key"
        :query="tradeQuery"
        :type="tradeType"
        :enable-collection-swap="tradeType === TradeType.SWAP"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TradeTableQuery } from '@/components/trade/TradeActivityTable.vue'
import { TradeType } from '@/components/trade/types'

defineProps<{
  tradeType: TradeType
}>()

const route = useRoute()

const collectionId = computed(() => route.params.id.toString())
const tradeCollection = computed(() => route.query.trade_collection === 'true')

const getTradeQuery = (direction: 'incoming' | 'outgoing') => {
  const directionQuery = {
    incoming: `considered: { id_eq: "${collectionId.value}" }`,
    outgoing: `nft: { collection: { id_eq: "${collectionId.value}" } }`,
  }[direction]

  const where = [
    'status_eq: ACTIVE',
    directionQuery,
  ]

  if (tradeCollection.value) {
    where.push(`desired_isNull: true`)
  }

  return `{ ${where.join(', ')} }`
}

const tradeQuery = computed<TradeTableQuery>(() => ({
  incoming: getTradeQuery('incoming'),
  outgoing: getTradeQuery('outgoing'),
}))

const key = computed(() => JSON.stringify(tradeQuery.value))
</script>
