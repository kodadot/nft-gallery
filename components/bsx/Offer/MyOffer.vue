<template>
  <div>
    <div v-if="!hideHeading" class="column is-8 is-offset-2">
      <h1 class="title is-2 has-text-centered">
        {{ $t('myOffer.bsxTitle') }}
      </h1>
    </div>
    <NeoSelect v-model="selectedStatus">
      <option
        v-for="option in getUniqType()"
        :key="option.type"
        :value="option.type">
        {{ option.value }}
      </option>
    </NeoSelect>
    <Loader v-model="isLoading" :status="status" />
    <NeoTable :data="displayOffers(offers)">
      <NeoTableColumn v-slot="props" :label="$t('nft.offer.item')" sortable>
        <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.nft.id}`">
          <p
            class="limit-width-text"
            :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
            {{ props.row.nft.name ? props.row.nft.name : props.row.nft.id }}
          </p>
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="formatPrice"
        :label="$t('myOffer.price')"
        sortable>
        <Money :value="props.row.price" inline />
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="caller"
        :label="$t('myOffer.caller')"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/u/${props.row.caller}`">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="expirationBlock"
        :label="$t('offer.expiration')"
        sortable>
        {{ calcExpirationTime(props.row.expiration) }}
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        :label="$t('offer.action')"
        width="120"
        sortable>
        <NeoButton
          v-if="props.row.caller === accountId"
          no-shadow
          icon-left="times"
          @click.native="onClick(props.row, true)" />
        <NeoButton
          v-else
          variant="success"
          no-shadow
          icon-left="money-bill"
          @click.native="onClick(props.row, false)" />
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="createdAt"
        :label="$t('myOffer.date')"
        sortable>
        <p>
          {{ timeAgo(new Date(props.row.createdAt).getTime()) }}
        </p>
      </NeoTableColumn>
      <template #empty>
        <div class="w-100 has-text-centered">
          {{ $t(isLogIn ? 'myOffer.empty' : 'myOffer.needLogin') }}
        </div>
      </template>
    </NeoTable>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoSelect, NeoTable, NeoTableColumn } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'
import Money from '@/components/shared/format/Money.vue'

import { notificationTypes, showNotification } from '@/utils/notification'
import { tokenIdToRoute } from '@/components/unique/utils'
import { timeAgo } from '@/components/collection/utils/timeAgo'
import { formatBsxBalanceToNumber } from '@/utils/format/balance'
import { AllOfferStatusType } from '@/utils/offerStatus'

import acceptableOfferByCurrentOwner from '@/queries/subsquid/bsx/acceptableOfferByCurrentOwner.graphql'

import { Offer, OfferResponse } from './types'

const { howAboutToExecute, initTransactionLoader, isLoading, status } =
  useMetaTransaction()
const { $apollo, $consola, $i18n } = useNuxtApp()
const { urlPrefix, client } = usePrefix()
const { accountId, isLogIn } = useAuth()

const offers = ref<Offer[]>([])
const destinationAddress = ref('')
const selectedStatus = ref<AllOfferStatusType>(AllOfferStatusType.ALL)

withDefaults(
  defineProps<{
    address: string
    hideHeading: boolean
  }>(),
  {
    address: '',
    hideHeading: false,
  }
)

const targetAddress = computed(() => destinationAddress || accountId)

const getUniqType = () => {
  const statusSet = new Set(offers.value.map((offer) => offer.status))
  const singleEventList = Array.from(statusSet).map((type) => ({
    type: type as AllOfferStatusType,
    value: AllOfferStatusType[type],
  }))

  return [{ type: AllOfferStatusType.ALL, value: 'All' }, ...singleEventList]
}

const fetchMyOffers = async () => {
  if (!targetAddress.value) {
    return
  }

  try {
    const { data } = await $apollo.query<OfferResponse>({
      client: client.value,
      query: acceptableOfferByCurrentOwner,
      variables: {
        id: targetAddress.value,
      },
    })
    setResponse(data)
  } catch (e) {
    $consola.error(e)
  }
}

const setResponse = (response: OfferResponse) => {
  offers.value = response.offers
}

onMounted(() => {
  if (targetAddress.value) {
    // $apollo.addSmartQuery<OfferResponse>('offers', {
    //   client: client.value,
    //   query: acceptableOfferByCurrentOwner,
    //   variables: { id: targetAddress.value },
    //   manual: true,
    //   result: ({ data }) => setResponse(data),
    //   pollInterval: 10000,
    // })
  }
})

const emit = defineEmits(['offersIncoming'])
const offersIncoming = (response: OfferResponse) => {
  emit('offersIncoming', setResponse(response))
}

const submit = async (
  maker: string,
  nftId: string,
  collectionId: string,
  withdraw: boolean,
  onSuccess?: () => void
) => {
  try {
    const { apiInstance } = useApi()
    const api = await apiInstance.value
    initTransactionLoader()
    const cb = !withdraw
      ? api.tx.marketplace.acceptOffer
      : api.tx.marketplace.withdrawOffer
    const args = [collectionId, nftId, maker]

    await howAboutToExecute(accountId.value, cb, args, (blockNumber) => {
      const msg = !withdraw
        ? $i18n.t('offer.accept')
        : $i18n.t('offer.withdraw')
      showNotification(
        `[OFFER] Since block ${blockNumber}, ${msg}`,
        notificationTypes.success
      )
      onSuccess && onSuccess()
    })
  } catch (e: any) {
    showNotification(`[OFFER::ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isLoading.value = false
  }
}

const onClick = async (offer: Offer, withdraw: boolean) => {
  const { caller, nft } = offer
  const { id: collectionId, item } = tokenIdToRoute(nft.id)
  isLoading.value = true
  await submit(caller, item, collectionId, withdraw, fetchMyOffers)
}

const displayOffers = (offers: Offer[]) => {
  let filterOffers: Offer[]
  if (selectedStatus.value === AllOfferStatusType.ALL) {
    filterOffers = offers.concat()
  } else {
    filterOffers = offers.filter(
      (offer) => offer.status === selectedStatus.value
    )
  }

  return filterOffers.map((offer) => ({
    ...offer,
    formatPrice: formatBsxBalanceToNumber(offer.price),
    expirationBlock: parseInt(offer.expiration),
  }))
}

watch(accountId, () => {
  fetchMyOffers()
})
// watch(componentsProps.address, (newval) => {
//   destinationAddress.value = newval
//   fetchMyOffers()
// })
</script>

<style scoped>
.limit-width-text {
  max-width: 50ch;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
