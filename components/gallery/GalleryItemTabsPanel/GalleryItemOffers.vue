<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <NeoTable v-if="offers?.length" :data="offers" hoverable>
      <!-- token price -->
      <NeoTableColumn
        v-slot="props"
        field="id"
        :label="`${$t(`offer.price`)} (${chainSymbol})`">
        {{ getOffersDetails(props.row.id).token }}
      </NeoTableColumn>

      <!-- usd price -->
      <NeoTableColumn v-slot="props" field="id" :label="$t('offer.usdPrice')">
        {{ getOffersDetails(props.row.id).usd }}
      </NeoTableColumn>

      <!-- floor difference -->
      <NeoTableColumn
        v-slot="props"
        field="id"
        :label="$t('offer.floorDifferences')">
        {{ getOffersDetails(props.row.id).floorDifference }}
      </NeoTableColumn>

      <!-- expiration -->
      <NeoTableColumn
        v-slot="props"
        field="expiration"
        :label="$t('offer.expiration')">
        {{ expirationTime(props.row.expiration) }}
      </NeoTableColumn>

      <!-- caller -->
      <NeoTableColumn v-slot="props" field="caller" :label="$t('offer.caller')">
        <nuxt-link
          :to="`/${urlPrefix}/u/${props.row.caller}`"
          class="has-text-link">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </NeoTableColumn>
      <!-- status -->
      <NeoTableColumn v-slot="props" field="status" :label="$t('offer.status')">
        <span
          :class="{
            'has-text-danger': props.row.status === OfferStatusType.WITHDRAWN,
            'has-text-success':
              props.row.status === OfferStatusType.ACTIVE &&
              props.row.expiration >= currentBlock,
            'has-text-warning': isInactiveOffer(
              props.row.status,
              props.row.expiration
            ),
          }"
          >{{ formatOfferStatus(props.row.status, props.row.expiration) }}</span
        >
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" field="action">
        <NeoSecondaryButton
          v-if="
            (props.row.caller === accountId || isOwner) && isActive(props.row)
          "
          variant="primary"
          @click="onWithdrawOffer(props.row.caller)"
          >Cancel</NeoSecondaryButton
        >
        <NeoSecondaryButton
          v-if="isOwner && isActiveAndNotExpired(props.row)"
          variant="info"
          @click="onAcceptOffer(props.row.caller)"
          >Accept</NeoSecondaryButton
        >
      </NeoTableColumn>
    </NeoTable>
    <div v-else class="has-text-centered">{{ $t('nft.offer.empty') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { NeoSecondaryButton, NeoTable, NeoTableColumn } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'
import { getKSMUSD } from '@/utils/coingecko'
import formatBalance from '@/utils/format/balance'
import { formatSecondsToDuration } from '@/utils/format/time'
import type { Offer, OfferResponse } from '@/components/bsx/Offer/types'
import type { CollectionEvents } from '@/components/rmrk/service/scheme'
import { OfferStatusType } from '@/utils/offerStatus'
import { notificationTypes, showNotification } from '@/utils/notification'
import { isOwner as checkOwner } from '@/utils/account'
import { ShoppingActions } from '@/utils/shoppingActions'
import Loader from '@/components/shared/Loader.vue'

const { $i18n, $consola } = useNuxtApp()

const { apiInstance } = useApi()
const { urlPrefix } = usePrefix()
const { decimals, chainSymbol } = useChain()

const { transaction, status, isLoading } = useTransaction()

const dprops = defineProps<{
  collectionId: string
  nftId: string
  account: string
}>()

const isOwner = computed(() => checkOwner(dprops.account, accountId.value))

const isActive = (row) => row.status === OfferStatusType.ACTIVE

const isActiveAndNotExpired = (row) =>
  isActive(row) && expirationTime(row.expiration) !== 'Expired'

const { accountId } = useAuth()

const { data, refetch } = useGraphql({
  queryName: 'offerListByNftId',
  queryPrefix: 'chain-bsx',
  variables: {
    id: dprops.nftId,
    orderBy: ['expiration_DESC', 'price_DESC'],
  },
  options: {
    fetchPolicy: 'network-only',
  },
})

useSubscriptionGraphql({
  query: `offers(where: { nft: { id_eq: "${dprops.nftId}" } }) {
    id
    caller
    expiration
    price
    status
  }`,
  onChange: refetch,
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

const getOffersDetails = (id: string) => {
  return offersAdditionals.value[id]
}

const getPercentage = (numA: number, numB: number) => {
  if (!numA || !numB) {
    return '--'
  }
  return Math.round(((numA - numB) / numB) * 100) + '%'
}

const formatPrice = (price: string) => {
  return formatBalance(price, decimals.value, '')
}

const isInactiveOffer = (status: OfferStatusType, expiration: number) => {
  return status === OfferStatusType.ACTIVE && expiration < currentBlock.value
}

const expirationTime = (block: number) => {
  if (currentBlock.value > block) {
    return 'Expired'
  }

  const secondsToBlock = 12 * (block - currentBlock.value)

  return formatSecondsToDuration(secondsToBlock)
}

const formatOfferStatus = (status: OfferStatusType, expiration: number) => {
  switch (status) {
    case OfferStatusType.WITHDRAWN:
      return $i18n.t('offer.withdrawn')
    case OfferStatusType.ACTIVE:
      if (isInactiveOffer(status, expiration)) {
        return $i18n.t('offer.inactive')
      }
      return $i18n.t('offer.active')
    case OfferStatusType.ACCEPTED:
      return $i18n.t('offer.accepted')
    default:
      return status
  }
}

const onWithdrawOffer = async (caller: string) => {
  await submit(caller, ShoppingActions.WITHDRAW_OFFER)
}

const onAcceptOffer = async (caller: string) => {
  await submit(caller, ShoppingActions.ACCEPT_OFFER)
}

onMounted(async () => {
  const api = await apiInstance.value
  const block = await api.rpc.chain.getHeader()
  currentBlock.value = block.number.toNumber()
})

const submit = async (
  maker: string,
  interaction:
    | typeof ShoppingActions.WITHDRAW_OFFER
    | typeof ShoppingActions.ACCEPT_OFFER
) => {
  try {
    await transaction({
      interaction: interaction,
      maker: maker,
      nftId: dprops.nftId,
      successMessage: $i18n.t('transaction.offer.success') as string,
      errorMessage: $i18n.t('transaction.item.error') as string,
    })
  } catch (e: any) {
    showNotification(`[OFFER::ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
  }
}

watch(
  [
    data as unknown as OfferResponse,
    dataCollection as unknown as CollectionEvents,
  ],
  async ([offersData, collectionData]) => {
    const nftPrice = collectionData?.collectionEntity?.nfts[0]?.price
    if (offersData.value?.offers) {
      const ksmPrice = await getKSMUSD()
      const floorPrice = formatPrice(nftPrice || '')

      offers.value = offersData.value.offers

      offersData.value.offers.map((offer) => {
        const price = formatPrice(offer.price)

        const token = price
        const usd = `$${Math.round(Number(price) * ksmPrice)}`
        const floorDifference = getPercentage(Number(price), Number(floorPrice))

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
