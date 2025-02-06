<template>
  <div>
    <SigningModal
      :title="details.signingTitle"
      :is-loading="isLoading"
      :status="status"
      close-at-signed
      @try-again="execTransaction"
    />

    <NeoModal
      :value="modelValue"
      append-to-body
      @close="onClose"
    >
      <ModalBody
        :title="details.title"
        :body-class="loading ? 'min-h-[350px]' : ''"
        :loading="loading"
        @close="onClose"
      >
        <ModalIdentityItem />

        <TradeOverviewModalContent
          v-if="trade && nft"
          :key="session"
          :desired="nft.desired"
          :offered="nft.offered"
          :trade="trade"
          :send-item="sendItem"
          @send-item:select="selectSendItem"
          @send-item:clear="clearSendItem"
        />

        <div
          v-if="trade"
          class="!pt-5"
        >
          <TradeOwnerButton
            main-class="!w-full capitalize"
            :trade="trade"
            :label="label"
            :disabled="disabled"
            @click:main="execTransaction"
          />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import { useQuery } from '@tanstack/vue-query'
import {
  type OverviewMode,
  type ExecTxParams,
  useIsTradeOverview,
  TradeTypeTx,
} from './utils'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import {
  type TradeNftItem,
  TradeType,
} from '@/components/trade/types'
import type { NFT } from '@/types'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'

type OverviewModeDetails = {
  title: string
  signingTitle: string
  notificationTitle: string
}

type Details = {
  transactionSuccessTitle: string
  transactionSuccessTab: string
}

type TradeNFTs = { desired?: NFT, offered: NFT }

const { $i18n } = useNuxtApp()

const TradeTypeOverviewModeDetails: Record<TradeType, Record<OverviewMode, OverviewModeDetails>> = {
  [TradeType.SWAP]: {
    incoming: {
      title: $i18n.t('swap.incomingSwap'),
      signingTitle: $i18n.t('transaction.acceptSwap'),
      notificationTitle: $i18n.t('swap.acceptSwap'),
    },
    owner: {
      title: $i18n.t('swap.yourSwap'),
      signingTitle: $i18n.t('transaction.cancelSwap'),
      notificationTitle: $i18n.t('swap.swapCancellation'),
    },
  },
  [TradeType.OFFER]: {
    incoming: {
      title: $i18n.t('offer.incomingOffer'),
      signingTitle: $i18n.t('transaction.acceptOffer'),
      notificationTitle: $i18n.t('offer.offerAccept'),
    },
    owner: {
      title: $i18n.t('offer.yourOffer'),
      signingTitle: $i18n.t('transaction.cancelOffer'),
      notificationTitle: $i18n.t('offer.offerCancellation'),
    },
  },
}

const TradeTypeDetails: Record<TradeType, Details> = {
  [TradeType.SWAP]: {
    transactionSuccessTitle: $i18n.t('swap.manageSwaps'),
    transactionSuccessTab: 'swaps',
  },
  [TradeType.OFFER]: {
    transactionSuccessTitle: $i18n.t('offer.manageOffers'),
    transactionSuccessTab: 'offers',
  },
}

const emit = defineEmits(['close'])
const props = defineProps<{
  modelValue: boolean
  trade?: TradeNftItem
}>()

const selectedSendItemId = ref<string>()
const session = ref<string>()
const vModel = useVModel(props, 'modelValue')

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const { transaction, status, isError, isLoading } = useTransaction({ disableSuccessNotification: true })
const { notification, lastSessionId, updateSession } = useLoadingNotfication()
const { mode, isIncomingTrade } = useIsTradeOverview(computed(() => props.trade))

const trade = computed(() => props.trade)
const needsToSelectSendItem = computed(() => isIncomingTrade.value && !sendItem.value && Boolean(trade.value?.isAnyTokenInCollectionDesired))
const disabled = computed(() => needsToSelectSendItem.value)

const label = computed<string | undefined>(() => {
  if (needsToSelectSendItem.value) {
    return $i18n.t('trade.selectSendItem')
  }
  return undefined
})

const details = computed<Details & OverviewModeDetails>(() =>
  trade.value
    ? {
        ...TradeTypeDetails[trade.value.type],
        ...TradeTypeOverviewModeDetails[trade.value.type][mode.value],
      }
    : {
        title: '',
        signingTitle: '',
        notificationTitle: '',
        transactionSuccessTitle: '',
        transactionSuccessTab: '',
      })

const { data: nft, isLoading: nftLoading } = useQuery<TradeNFTs | null>({
  queryKey: ['trade-nft', computed(() => trade.value?.id)],
  queryFn: async () => {
    if (!trade.value) {
      return null
    }

    const promises = [
      fetchNft(trade.value.offered.id),
    ]

    if (trade.value.desired) {
      promises.push(fetchNft(trade.value.desired.id))
    }

    const [offered, desired] = await Promise.all(promises)

    return {
      offered,
      desired,
    }
  },
})

const { data: sendItem } = useQuery({
  queryKey: ['send-item', selectedSendItemId],
  queryFn: async () => {
    if (!selectedSendItemId.value) {
      return null
    }
    return await fetchNft(selectedSendItemId.value)
  },
})

const loading = computed(() => nftLoading.value || !nft.value)

const selectSendItem = item => selectedSendItemId.value = item.id
const clearSendItem = () => selectedSendItemId.value = undefined

const onClose = () => {
  vModel.value = false
  onModalAnimation(() => emit('close'))
}

const reset = () => {
  clearSendItem()
}

const execTransaction = () => {
  if (!nft.value || !trade.value) {
    return
  }

  vModel.value = false

  const params: ExecTxParams = {
    trade: trade.value,
    transaction,
    urlPrefix: urlPrefix.value,
    sendItem: trade.value.desired?.sn || sendItem.value?.sn as string,
  }

  TradeTypeTx[trade.value.type][mode.value](params)
}

const initSession = () => {
  session.value = window.crypto.randomUUID()
  reset()
}

useModalIsOpenTracker({
  isOpen: vModel,
  onClose: false,
  onChange: initSession,
})

useTransactionNotification({
  status,
  isError,
  sessionId: lastSessionId,
  updateSession,
  init: () => {
    vModel.value = false
    return notification(({ isSessionState, notify, session }) => {
      return notify({
        title: details.value.notificationTitle,
        state: computed(() => session.value.state),
        action: computed(() => {
          if (isSessionState('succeeded')) {
            return {
              label: details.value.transactionSuccessTitle,
              icon: 'arrow-up-right',
              url: `/${urlPrefix.value}/u/${accountId.value}?tab=${details.value.transactionSuccessTab}&filter=outgoing`,
            }
          }
          return undefined
        }),
        showIndexerDelayMessage: true,
      })
    })
  },
})
</script>

<style lang="scss" scoped>
// make prop
:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
