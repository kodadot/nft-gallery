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
      >
        <template #action>
          <CreateCollectionSwapButton
            v-if="isTradeSwap(tradeType) && collectionId"
            :collection-id="collectionId"
          />
          <CreateCollectionOfferButton
            v-if="isTradeOffer(tradeType) && collectionId"
            :collection-id="collectionId"
          />
        </template>
      </TradeActivityTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TradeTableQuery } from '@/components/trade/TradeActivityTable.vue'
import type { TradeType } from '@/components/trade/types'
import { isTradeSwap } from '@/composables/useTradeType'
import CreateCollectionSwapButton from '@/components/swap/CreateCollectionSwapButton.vue'
import CreateCollectionOfferButton from '@/components/trade/makeOffer/CreateCollectionOfferButton.vue'

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
