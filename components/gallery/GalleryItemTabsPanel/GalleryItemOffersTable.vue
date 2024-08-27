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
      v-else-if="nftOffers.length"
      :data="nftOffers"
      hoverable
      class="py-5 padding-top-mobile"
    >
      <!-- price -->
      <NeoTableColumn
        v-slot="{ row }: {row: NFTOffer}"
        width="10%"
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
        v-slot="{ row }: {row: NFTOffer}"
        width="10%"
        field="expiration"
        :label="$t('expiration')"
      >
        <p
          v-if="row.expiration"
          class="capitalize"
        >
          {{ formatToBlock(row.expiration) }}
        </p>
      </NeoTableColumn>

      <!-- from -->
      <NeoTableColumn
        v-slot="{ row }: {row: NFTOffer}"
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
    </NeoTable>
    <div
      v-else
      class="p-5"
    >
      {{ $t('tabs.tabActivity.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
} from '@kodadot1/brick'
import { addHours } from 'date-fns'
import offersByNftId from '@/queries/subsquid/general/offersByNftId.graphql'
import Identity from '@/components/identity/IdentityIndex.vue'
import formatBalance, {
  formatNumber,
  withoutDigitSeparator,
} from '@/utils/format/balance'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import type { NFTOffer } from '@/composables/useNft'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { formatToNow } from '@/utils/format/time'

const BLOCKS_PER_HOUR = 300

const props = defineProps<{
  nftId: string
}>()

const fiatStore = useFiatStore()
const { decimals, chainSymbol } = useChain()
const { urlPrefix, client } = usePrefix()

const currentBlock = ref(0)

const tokenPrice = computed(() => Number(fiatStore.getCurrentTokenValue(prefixToToken[urlPrefix.value])))

const {
  data,
  pending: fetching,
  refresh,
} = await useAsyncQuery<{ offers: NFTOffer[] }>({
  query: offersByNftId,
  variables: {
    id: props.nftId,
    limit: 100,
  },
  clientId: client.value,
})

const loading = computed(() => !nftOffers.value.length && (fetching.value || !currentBlock.value))
const nftOffers = computed(() => data.value?.offers)

useSubscriptionGraphql({
  query: `
  offers (
    where: { desired: { id_eq: "${props.nftId}" } }
    orderBy: blockNumber_DESC
  ) {
    id
  }`,
  onChange: refresh,
})

const formatPrice = (price) => {
  const tokenAmount = formatBalance(price, decimals.value, false)
  const flatPrice = `${formatNumber(
    Number(withoutDigitSeparator(tokenAmount)) * tokenPrice.value,
  )}`
  return [formatNumber(tokenAmount), flatPrice]
}

async function getCurrentBlock() {
  const api = await useApi().apiInstance.value
  const { number } = await api.rpc.chain.getHeader()
  return number.toNumber()
}

const formatToBlock = (block: number) => {
  return formatToNow(
    addHours(new Date(), (Number(block) - currentBlock.value) / BLOCKS_PER_HOUR), false,
  )
}

onBeforeMount(() => getCurrentBlock().then(b => currentBlock.value = b))
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
