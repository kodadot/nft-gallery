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
      <!-- price -->
      <NeoTableColumn
        v-slot="{ row }: {row: NFTOfferItem}"
        width="20%"
        field="price"
        :label="$t('amount')"
      >
        <p
          v-if="Number(row.price)"
          class="flex gap-2"
        >
          <span> {{ formatPrice(row.price)[0] }} {{ chainSymbol }}</span>
          <span class="text-k-grey">
            ${{ formatPrice(row.price)[1] }}</span>
        </p>
      </NeoTableColumn>

      <!-- expiration -->
      <NeoTableColumn
        v-slot="{ row }: {row: NFTOfferItem}"
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
        v-slot="{ row }: {row: NFTOfferItem}"
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
        <OfferOwnerButton
          class="max-md:!w-full"
          :offer="row as NFTOfferItem"
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

  <OfferOverviewModal
    v-model="isWithdrawOfferModalOpen"
    :offer="selectedOffer!"
    @close="closeOfferOverviewModal"
  />
</template>

<script setup lang="ts">
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
} from '@kodadot1/brick'
import type { UnwrapRef } from 'vue'
import { formatToNow } from '@/utils/format/time'
import Identity from '@/components/identity/IdentityIndex.vue'
import formatBalance, {
  formatNumber,
  withoutDigitSeparator,
} from '@/utils/format/balance'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { prefixToToken } from '@/components/common/shoppingCart/utils'

const props = defineProps<{
  nftId: string
}>()

const fiatStore = useFiatStore()
const { decimals, chainSymbol } = useChain()
const { urlPrefix } = usePrefix()
const isWithdrawOfferModalOpen = ref(false)

const tokenPrice = computed(() => Number(fiatStore.getCurrentTokenValue(prefixToToken[urlPrefix.value]) || 0))

const loading = ref(false)
const offers = ref<UnwrapRef<ReturnType<typeof useOffers>['offers']>>([])
const selectedOffer = ref<NFTOfferItem>()
const stopWatch = ref(() => {})

useSubscriptionGraphql({
  query: `
  offers (
    where: { status_eq: ACTIVE, desired: { id_eq: "${props.nftId}" } }
    orderBy: blockNumber_DESC
  ) {
    id
  }`,
  onChange: ({ data: { offers: newOffers } }) => {
    stopWatch.value?.()
    offers.value = []

    const { offers: offersData, loading: offersLoading } = useOffers({
      where: { id_in: newOffers.map(offer => offer.id) },
    })

    stopWatch.value = watchEffect(() => {
      loading.value = offersLoading.value
      offers.value = offersData.value
    })
  },
})

const formatPrice = (price) => {
  const tokenAmount = formatBalance(price, decimals.value, false)
  const flatPrice = `${formatNumber(
    Number(withoutDigitSeparator(tokenAmount)) * tokenPrice.value,
  )}`
  return [formatNumber(tokenAmount), flatPrice]
}

const selectOffer = (offer: NFTOfferItem) => {
  selectedOffer.value = offer
  isWithdrawOfferModalOpen.value = true
}

const closeOfferOverviewModal = () => {
  isWithdrawOfferModalOpen.value = false
  selectedOffer.value = undefined
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.gallery-item-offers-table {
  overflow-y: auto;

  @include desktop {
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

@include touch {
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
