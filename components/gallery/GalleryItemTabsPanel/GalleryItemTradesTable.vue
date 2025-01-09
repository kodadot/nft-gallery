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
      v-else-if="offers.length"
      :data="offers"
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
          @click="selectOffer"
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
    v-model="isWithdrawTradeModalOpen"
    :trade="selectedTrade!"
    @close="closeTradeOverviewModal"
  />
</template>

<script setup lang="ts">
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
} from '@kodadot1/brick'
import type { UnwrapRef } from 'vue'
import { TradeType } from '@/composables/useTrades'
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

const isWithdrawTradeModalOpen = ref(false)
const loading = ref(false)
const offers = ref<UnwrapRef<ReturnType<typeof useTrades>['items']>>([])
const selectedTrade = ref<TradeNftItem>()
const stopWatch = ref(() => {})

useSubscriptionGraphql({
  query: `
  items: ${TRADES_QUERY_MAP[props.type].dataKey} (
    where: { status_eq: ACTIVE, desired: { id_eq: "${props.nftId}" } }
    orderBy: blockNumber_DESC
  ) {
    id
  }`,
  onChange: ({ data }) => {
    stopWatch.value?.()
    offers.value = []

    const { items: offersData, loading: offersLoading } = useTrades({
      where: { id_in: data.items?.map(offer => offer.id) },
      type: props.type,
    })

    stopWatch.value = watchEffect(() => {
      loading.value = offersLoading.value
      offers.value = offersData.value
    })
  },
})

const selectOffer = (offer: TradeNftItem) => {
  selectedTrade.value = offer
  isWithdrawTradeModalOpen.value = true
}

const closeTradeOverviewModal = () => {
  isWithdrawTradeModalOpen.value = false
  selectedTrade.value = undefined
}
</script>

<style lang="scss" scoped>
.gallery-item-offers-table {
  overflow-y: auto;

  // Between 1024px and 1215px
  @media screen and (min-width: 1024px) and (max-width: 1215px) {
    :deep(table tr > *:first-child) {
      padding-left: 2rem;
    }
    :deep(table tbody > tr > td) {
      vertical-align: middle;
      height: 3.25rem;
      &:last-child {
         padding: 0;
      }
    }
  }
}

// up to 1023px
@media screen and (max-width: 1023px) {
  .gallery-item-offers-table {
    :deep(.o-table__td) {
      @apply border-inherit;
      padding: 0;
      &:before {
        font-weight: 400 !important;
      }
    }

    :deep(.o-table__td:not(:nth-last-child(1)):not(:nth-last-child(2))) {
      padding: 0 0 1rem 0;
    }

    .o-table__td:last-child button {
      margin-top: 1.5rem
    }
  }
}
</style>
