<template>
  <div class="py-5">
    <o-table v-if="offers?.length" :data="offers" hoverable>
      <!-- token price -->
      <o-table-column v-slot="props" field="id" :label="$t('offer.price')">
        {{ getOffersDetails(props.row.id).token }}
      </o-table-column>

      <!-- usd price -->
      <o-table-column v-slot="props" field="id" :label="$t('offer.usdPrice')">
        {{ getOffersDetails(props.row.id).usd }}
      </o-table-column>

      <!-- floor difference -->
      <o-table-column
        v-slot="props"
        field="id"
        :label="$t('offer.floorDifferences')">
        {{ getOffersDetails(props.row.id).floorDifference }}
      </o-table-column>

      <!-- expiration -->
      <o-table-column
        v-slot="props"
        field="expiration"
        :label="$t('offer.expiration')">
        {{ expirationTime(props.row.expiration) }}
      </o-table-column>

      <!-- caller -->
      <o-table-column v-slot="props" field="caller" :label="$t('offer.caller')">
        <nuxt-link
          :to="`/${urlPrefix}/u/${props.row.caller}`"
          class="has-text-link">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </o-table-column>
      <!-- status -->
      <o-table-column v-slot="props" field="status" :label="$t('offer.status')">
        <span
          :class="{
            'has-text-danger': props.row.status === OfferStatusType.WITHDRAWN,
            'has-text-success':
              props.row.status === OfferStatusType.ACTIVE &&
              props.row.expiration >= currentBlock,
            'has-text-warning':
              props.row.status === OfferStatusType.ACTIVE &&
              props.row.expiration < currentBlock,
          }"
          >{{ formatOfferStatus(props.row.status, props.row.expiration) }}</span
        >
      </o-table-column>
    </o-table>
    <div v-else class="has-text-centered">{{ $t('nft.offer.empty') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { OTable, OTableColumn } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'

import { getKSMUSD } from '@/utils/coingecko'
import formatBalance from '@/utils/format/balance'
import { formatSecondsToDuration } from '@/utils/format/time'

import type { Offer, OfferResponse } from '@/components/bsx/Offer/types'
import type { CollectionEvents } from '@/components/rmrk/service/scheme'
import { OfferStatusType } from '@/utils/offerStatus'
const { $i18n } = useNuxtApp()

const { apiInstance } = useApi()
const { urlPrefix, tokenId, assets } = usePrefix()
const { decimals } = useChain()

const dprops = defineProps<{
  collectionId: string
  nftId: string
  account: string
}>()

const { data } = useGraphql({
  queryName: 'offerListByNftId',
  queryPrefix: 'chain-bsx',
  variables: {
    id: dprops.nftId,
    account: dprops.account,
  },
})

const { data: dataCollection } = useGraphql({
  queryName: 'collectionById',
  variables: {
    id: dprops.collectionId,
    first: 1,
    search: [{ price_gt: '0' }],
    orderBy: 'price_ASC',
  },
})

const offers = ref<Offer[]>()
const offersAdditionals = ref({})
const currentBlock = ref(0)

const getOffersDetails = (id) => {
  return offersAdditionals.value[id]
}

const formatPrice = (price) => {
  return formatBalance(price, decimals.value, '')
}

const getPercentage = (numA, numB) => {
  return Math.round(((numA - numB) / numB) * 100)
}

const expirationTime = (block) => {
  if (currentBlock.value > block) {
    return 'Expired'
  }

  const secondsToBlock = 12 * (block - currentBlock.value)

  return formatSecondsToDuration(secondsToBlock)
}

const formatOfferStatus = (status: OfferStatusType, expiration: number) => {
  if (status === OfferStatusType.WITHDRAWN) {
    return $i18n.t('offer.withdrawn')
  }

  if (status === OfferStatusType.ACTIVE && expiration < currentBlock.value) {
    return $i18n.t('offer.inactive')
  }
  return status
}

onMounted(async () => {
  const api = await apiInstance.value
  const block = await api.rpc.chain.getHeader()
  currentBlock.value = block.number.toNumber()
})

watch(
  [
    data as unknown as OfferResponse,
    dataCollection as unknown as CollectionEvents,
  ],
  async ([offersData, collectionData]) => {
    const nftPrice = collectionData?.collectionEntity?.nfts[0]?.price

    if (offersData?.offers.length && nftPrice) {
      const ksmPrice = await getKSMUSD()
      const floorPrice = formatPrice(nftPrice)

      offers.value = offersData.offers

      offersData.offers.map((offer) => {
        const price = formatPrice(offer.price)
        const { symbol } = assets(tokenId.value)

        const token = `${price} ${symbol}`
        const usd = `$${Math.round(Number(price) * ksmPrice)}`
        const floorDifference = `${getPercentage(price, floorPrice)}%`

        offersAdditionals.value[offer.id] = {
          token,
          usd,
          floorDifference,
        }
      })
    }
  }
)
</script>

<style lang="scss" scoped></style>
