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
      />
    </div>
  </div>

  <div class="container is-fluid !pb-8" />
</template>

<script setup lang="ts">
import { type TradeTableQuery } from '@/components/trade/TradeActivityTable.vue'

const tradeType = TradeType.SWAP

const route = useRoute()

const collectionId = computed(() => route.params.id.toString())
const tradeCollection = computed(() => route.query.trade_collection === 'true')

const getTradeQuery = (target: 'nft' | 'desired') => {
  const where = [
    'status_eq: ACTIVE',
    `${target}: { collection: { id_eq: "${collectionId.value}" } }`,
  ]

  if (tradeCollection.value) {
    where.push(`desired_isNull: true`)
  }

  return `{ ${where.join(', ')} }`
}

const tradeQuery = computed<TradeTableQuery>(() => ({
  incoming: getTradeQuery('desired'),
  outgoing: getTradeQuery('nft'),
}))

const key = computed(() => JSON.stringify(tradeQuery.value))
</script>
