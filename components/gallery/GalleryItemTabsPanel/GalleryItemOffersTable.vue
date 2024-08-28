<template>
  <div
    class="gallery-item-activity-table flex flex-col !py-6"
    data-testid="gallery-item-activity-table"
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
      class="py-5 padding-top-mobile"
    >
      <!-- price -->
      <NeoTableColumn
        v-slot="{ row }: {row: NFTOfferItem}"
        width="20%"
        field="price"
        :label="$t('amount')"
      >
        <p v-if="Number(row.price)">
          {{ formatPrice(row.price)[0] }} {{ chainSymbol }}
          <span class="text-k-grey">
            ${{ formatPrice(row.price)[1] }}</span>
        </p>
      </NeoTableColumn>

      <!-- price -->
      <NeoTableColumn
        v-slot="{ row }: {row: NFTOfferItem}"
        width="10%"
        field="expiration"
        :label="$t('expiration')"
      >
        <p
          v-if="row.expiration"
          class="capitalize"
        >
          {{ row.time }}
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
          @withdraw="withdrawOffer"
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

  <OfferWithdrawModal
    v-model="isWithdrawOfferModalOpen"
    :offer="selectedOffer!"
    @close="closeWithdrawModal"
  />
</template>

<script setup lang="ts">
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
} from '@kodadot1/brick'
import type { UnwrapRef } from 'vue'
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

const withdrawOffer = (offer: NFTOfferItem) => {
  selectedOffer.value = offer
  isWithdrawOfferModalOpen.value = true
}

const closeWithdrawModal = () => {
  isWithdrawOfferModalOpen.value = false
  selectedOffer.value = undefined
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.gallery-item-activity-table {
  overflow-y: auto;

  @include desktop {
    :deep(table tr > *:first-child) {
      padding-left: 2rem;
    }
  }
}

@include touch {
  .gallery-item-activity-table {
    :deep(.o-table__td) {
      @apply border-inherit;

      &:before {
        font-weight: 400 !important;
      }
    }
  }
}
@include mobile {
  .padding-top-mobile {
    padding-top: 0 !important;
  }
}
</style>
