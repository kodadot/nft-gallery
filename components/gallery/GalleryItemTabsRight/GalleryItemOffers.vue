<template>
  <div class="py-5">
    <o-table v-if="offers?.length" :data="offers" hoverable>
      <o-table-column v-slot="props" field="id" label="Price">
        {{ getOffersDetails(props.row.id).token }}
      </o-table-column>
      <o-table-column v-slot="props" field="id" label="(USD)">
        {{ getOffersDetails(props.row.id).usd }}
      </o-table-column>
      <o-table-column v-slot="props" field="id" label="Floor Difference">
        {{ getOffersDetails(props.row.id).floorDifference }}
      </o-table-column>
      <o-table-column label="Expiration"> 3 Hours </o-table-column>
      <o-table-column v-slot="props" field="caller" label="From">
        <a
          :href="`/${urlPrefix}/u/${props.row.caller}`"
          target="_blank"
          rel="noopener noreferrer">
          <Identity :address="props.row.caller" />
        </a>
      </o-table-column>
    </o-table>
  </div>
</template>

<script lang="ts" setup>
import { OTable, OTableColumn } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'

import { getKSMUSD } from '@/utils/coingecko'
import formatBalance from '@/utils/formatBalance'

import type { Offer, OfferResponse } from '@/components/bsx/Offer/types'
import type { CollectionEvents } from '@/components/rmrk/service/scheme'

const { urlPrefix } = usePrefix()
const { decimals, unit } = useChain()

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

const getOffersDetails = (id) => {
  return offersAdditionals.value[id]
}

const formatPrice = (price) => {
  return parseFloat(formatBalance(price, decimals.value, '')).toFixed(2)
}

const getPercentage = (numA, numB) => {
  return Math.round(((numA - numB) / numB) * 100)
}

watch(
  [
    data as unknown as OfferResponse,
    dataCollection as unknown as CollectionEvents,
  ],
  async ([offersData, collectionData]) => {
    if (
      offersData?.offers.length &&
      collectionData?.collectionEntity.nfts[0].price
    ) {
      const ksmPrice = await getKSMUSD()
      const floorPrice = formatPrice(
        collectionData?.collectionEntity.nfts[0].price
      )

      offers.value = offersData.offers

      offersData.offers.map((offer) => {
        const price = formatPrice(offer.price)
        // TODO: how to get proper unit on bsx?
        // on bsx unit.value should be 'KSM' || 'BSX'
        const token = `${price} ${unit.value}`
        const usd = `$${Math.round(Number(price) * ksmPrice)}`
        const floorDifference = `${getPercentage(price, floorPrice)}%`

        offersAdditionals.value[offer.id] = {
          token,
          usd,
          floorDifference,
          expiration: '3 Hours',
        }
      })
    }

    console.log(collectionData)
  }
)
</script>

<style lang="scss" scoped></style>
