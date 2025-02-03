<template>
  <div
    class="gallery-item-offers-table flex flex-col !py-6"
    data-testid="gallery-item-offers-table"
  >
    <div
      v-if="loading"
      class="p-5"
    >
      <NeoSkeleton
        animated
        size="large"
        :count="3"
      />
    </div>
    <NeoTable
      v-else-if="trades.length"
      :data="trades"
      hoverable
      class="py-5 max-md:!top-0"
    >
      <!-- item -->
      <NeoTableColumn
        v-if="type === TradeType.SWAP"
        v-slot="{ row }: {row: TradeNftItem}"
        width="20%"
        field="item"
        :label="$t('activity.event.item')"
      >
        <div class="flex-1 text-clip">
          <div class="flex items-center gap-4">
            <nuxt-link
              :to="`/${urlPrefix}/gallery/${row.offered.id}`"
            >
              <BaseMediaItem
                class="border border-k-shade w-[2.25rem] h-[2.25rem] !shadow-none"
                :alt="row.offered.name"
                :src="sanitizeIpfsUrl(row.offered.image)"
                preview
                is-detail
              />
            </nuxt-link>
            <nuxt-link
              class="text-ellipsis inline-block"
              :to="`/${urlPrefix}/gallery/${row.offered.id}`"
            >
              <span class="text-clip">
                {{ row.offered.name }}
              </span>
            </nuxt-link>
          </div>
        </div>
      </NeoTableColumn>

      <!-- price -->
      <NeoTableColumn
        v-if="type === TradeType.OFFER"
        v-slot="{ row }: {row: TradeNftItem}"
        width="20%"
        field="price"
        :label="$t('amount')"
      >
        <p
          v-if="Number(row.price)"
          class="flex gap-2"
        >
          <span> {{ format(row.price).amount }} </span>
          <span class="text-k-grey"> {{ format(row.price).price }} </span>
        </p>
      </NeoTableColumn>

      <!-- expiration -->
      <NeoTableColumn
        v-slot="{ row }: {row: TradeNftItem}"
        width="15%"
        field="expiration"
        :label="$t('expiration')"
      >
        <p class="capitalize">
          {{ row.expirationDate ? formatToNow(row.expirationDate, false) : '--' }}
        </p>
      </NeoTableColumn>

      <!-- from -->
      <NeoTableColumn
        v-slot="{ row }: {row: TradeNftItem}"
        width="20%"
        field="caller"
        :label="$t('tabs.tabActivity.from')"
      >
        <div class="flex items-center gap-2">
          <ProfileAvatar
            :size="24"
            :address="row.caller"
          />

          <nuxt-link
            :to="`/${urlPrefix}/u/${row.caller}`"
            class="text-k-blue hover:text-k-blue-hover"
          >
            <Identity
              :address="row.caller"
            />
          </nuxt-link>
        </div>
      </NeoTableColumn>

      <!-- action -->
      <NeoTableColumn
        v-slot="{ row }"
        width="10%"
      >
        <TradeOwnerButton
          class="max-md:!w-full"
          :trade="row as TradeNftItem"
          @click:main="selectOffer"
        />
      </NeoTableColumn>
    </NeoTable>
    <div
      v-else
      class="p-5"
    >
      {{ $t('tabs.tabActivity.empty') }}
    </div>
  </div>

  <TradeOverviewModal
    v-model="isTradeModalOpen"
    :trade="selectedTrade!"
    @close="closeTradeModal"
  />
</template>

<script setup lang="ts">
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
} from '@kodadot1/brick'
import { type TradeNftItem, TradeType } from '@/components/trade/types'
import { formatToNow } from '@/utils/format/time'
import Identity from '@/components/identity/IdentityIndex.vue'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const props = defineProps<{
  nftId: string
  type: TradeType
}>()

const { urlPrefix } = usePrefix()
const { format } = useFormatAmount()

const isTradeModalOpen = ref(false)
const selectedTrade = ref<TradeNftItem>()
const tradeIds = ref()

const { items: trades, loading } = useTrades({
  where: computed(() => ({ id_in: tradeIds.value })),
  disabled: computed(() => !Array.isArray(tradeIds.value)),
  type: props.type,
})

useSubscriptionGraphql({
  query: `
  items: ${TRADES_QUERY_MAP[props.type].dataKey} (
    where: { status_eq: ACTIVE, desired: { id_eq: "${props.nftId}" } }
    orderBy: blockNumber_DESC
  ) {
    id
  }`,
  onChange: ({ data }) => {
    tradeIds.value = data.items?.map(trade => trade.id)
  },
})

const selectOffer = (offer: TradeNftItem) => {
  selectedTrade.value = offer
  isTradeModalOpen.value = true
}

const closeTradeModal = () => {
  isTradeModalOpen.value = false
  selectedTrade.value = undefined
}
</script>

<style lang="scss" scoped>
.gallery-item-offers-table {
  overflow-y: auto;

  :deep(table tr > *:first-child) {
    @apply bulma-desktop:pl-8;
  }
  :deep(table tbody > tr > td) {
    @apply bulma-desktop:h-[3.25rem] bulma-desktop:align-middle;

    &:last-child {
      @apply bulma-desktop:p-0;
    }
  }
}

.gallery-item-offers-table {
  :deep(.o-table__td) {
    @apply bulma-touch:border-inherit bulma-touch:p-0;
    &:before {
      @apply bulma-touch:font-normal;
    }
  }

  :deep(.o-table__td:not(:nth-last-child(1)):not(:nth-last-child(2))) {
    @apply bulma-touch:p-0 bulma-touch:pb-4;
  }

  .o-table__td:last-child button {
    @apply bulma-touch:mt-6;
  }
}
</style>
