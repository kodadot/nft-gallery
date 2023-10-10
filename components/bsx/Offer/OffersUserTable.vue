<template>
  <div>
    <NeoSelect v-if="!offersListed" v-model="selectedStatus">
      <option
        v-for="option in getUniqType()"
        :key="option.type"
        :value="option.type">
        {{ option.value }}
      </option>
    </NeoSelect>
    <BasicSwitch
      v-if="!hideToggle"
      v-model="offersListed"
      class="mt-4"
      :label="$t('offer.burnedToggle')"
      size="is-medium"
      label-color="has-text-success"
      @input="updateList" />
    <Loader v-model="isLoading" :status="status" />
    <NeoTable :data="displayOffers(offers)">
      <NeoTableColumn
        v-slot="props"
        field="nft.name"
        :label="$t('nft.offer.item')"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.nft.id}`">
          <p
            class="limit-width-text"
            :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
            {{ props.row.nft.name || props.row.nft.id }}
          </p>
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="status"
        :label="$t('nft.offer.status')"
        sortable>
        <p>{{ props.row.status || '-' }}</p>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="formatPrice"
        :label="$t('offer.price')"
        sortable>
        <CommonTokenMoney :value="props.row.price" inline />
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
        field="createdAt"
        :label="$t('nft.offer.date')"
        sortable>
        <p>
          {{ timestampOffer(props.row.createdAt) }}
        </p>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="accountId === ownerId"
        v-slot="props"
        :label="$t('offer.action')"
        width="120">
        <NeoButton
          v-if="props.row.status === 'ACTIVE'"
          no-shadow
          icon-left="times"
          @click="withdrawOffer(props.row)" />
      </NeoTableColumn>
    </NeoTable>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoSelect, NeoTable, NeoTableColumn } from '@kodadot1/brick'

import { tokenIdToRoute } from '@/components/unique/utils'
import { formatBsxBalanceToNumber } from '@/utils/format/balance'
import { notificationTypes, showNotification } from '@/utils/notification'
import { AllOfferStatusType } from '@/utils/offerStatus'

import { formatDistanceToNow } from 'date-fns'
import { Offer } from './types'

import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'

const { howAboutToExecute, initTransactionLoader, isLoading, status } =
  useMetaTransaction()
const { $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const offersListed = ref(false)

const selectedStatus = ref<AllOfferStatusType>(AllOfferStatusType.ALL)

const emit = defineEmits(['offersListUpdate'])
const updateList = (data) => {
  emit('offersListUpdate', data)
}

const prop = withDefaults(
  defineProps<{
    offers: Offer[]
    ownerId: string
    hideToggle: boolean
  }>(),
  {
    ownerId: '',
    hideToggle: false,
  },
)

const timestampOffer = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

const displayOffers = (offers: Offer[]) => {
  let filterOffers: Offer[]
  if (selectedStatus.value === AllOfferStatusType.ALL) {
    filterOffers = offers.concat()
  } else {
    filterOffers = offers.filter(
      (offer) => offer.status === selectedStatus.value,
    )
  }

  return filterOffers.map((offer) => ({
    ...offer,
    formatPrice: formatBsxBalanceToNumber(offer.price),
    expirationBlock: parseInt(offer.expiration),
  }))
}

const withdrawOffer = async (offer) => {
  const { caller, nft } = offer
  try {
    const { apiInstance } = useApi()
    const api = await apiInstance.value
    initTransactionLoader()
    const cb = api.tx.marketplace.withdrawOffer
    const { id, item } = tokenIdToRoute(nft.id)
    const args = [id, item, caller]
    await howAboutToExecute(accountId.value, cb, args, (blockNumber) => {
      const msg = 'your offer has been withdrawn'
      showNotification(
        `[OFFER] Since block ${blockNumber} ${msg}`,
        notificationTypes.success,
      )
    })
  } catch (e: any) {
    showNotification(`[OFFER::ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isLoading.value = false
  }
}

const getUniqType = () => {
  const statusSet = new Set(prop.offers.map((offer) => offer.status))
  const singleEventList = Array.from(statusSet).map((type) => ({
    type: type as AllOfferStatusType,
    value: AllOfferStatusType[type],
  }))

  return [{ type: AllOfferStatusType.ALL, value: 'All' }, ...singleEventList]
}

const currentBlock = ref(async () => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const block = await api.rpc.chain.getHeader()
  return block.number.toNumber()
})

const calcExpirationTime = (expirationBlock: number): string => {
  if (currentBlock.value === 0) {
    return 'computing'
  }
  if (currentBlock.value > expirationBlock) {
    return 'expired'
  }
  return formatSecondsToDuration(calcSecondsToBlock(expirationBlock))
}
</script>

<style scoped>
.limit-width-text {
  max-width: 20ch;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
