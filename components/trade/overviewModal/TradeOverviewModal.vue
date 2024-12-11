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
        <div>
          <ModalIdentityItem />

          <template v-if="trade && nft">
            <TradeOverviewModalTypeSwap
              v-if="trade.type === TradeType.SWAP"
              :desired="nft.desired"
              :offered="nft.offered"
              :trade="trade"
            />
            <TradeOverviewModalTypeOffer
              v-if="trade.type === TradeType.OFFER"
              :desired="nft.desired"
              :trade="trade"
            />
          </template>
        </div>

        <div
          v-if="trade"
          class="!pt-5"
        >
          <TradeOwnerButton
            class="!w-full"
            :trade="trade"
            @click="execTransaction"
          />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import { useIsTradeOverview, type OverviewMode } from './utils'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import nftById from '@/queries/subsquid/general/nftById.graphql'
import { TradeType } from '@/composables/useTrades'
import type { NFT } from '@/types'

type OverviewModeDetails = {
  title: string
  signingTitle: string
  notificationTitle: string
}

type Details = {
  transactionSuccessTitle: string
  transactionSuccessTab: string
}

type TradeNFTs = { desired: NFT, offered: NFT }

type ExecTxParams = {
  trade: TradeNftItem
  desired: NFT
  offered: NFT
}

const emit = defineEmits(['close'])
const props = defineProps<{
  modelValue: boolean
  trade?: TradeNftItem
}>()

const vModel = useVModel(props, 'modelValue')

const { accountId } = useAuth()
const { urlPrefix, client } = usePrefix()
const { transaction, status, isError, isLoading } = useTransaction({ disableSuccessNotification: true })
const { $i18n } = useNuxtApp()
const { notification, lastSessionId, updateSession } = useLoadingNotfication()
const { mode } = useIsTradeOverview(computed(() => props.trade))

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

const TradeTypeTx: Record<TradeType, Record<OverviewMode, (params: ExecTxParams) => void>> = {
  [TradeType.SWAP]: {
    owner: ({ offered }) => {
      transaction({
        interaction: ShoppingActions.CANCEL_SWAP,
        urlPrefix: urlPrefix.value,
        offeredId: offered.sn,
        offeredCollectionId: offered.collection.id,
      })
    },
    incoming: ({ offered, desired, trade }) => {
      transaction({
        interaction: ShoppingActions.ACCEPT_SWAP,
        urlPrefix: urlPrefix.value,
        receiveItem: offered.sn,
        receiveCollection: offered.collection.id,
        sendCollection: desired.collection.id,
        sendItem: desired.sn,
        price: trade.price,
        surcharge: (trade as TradeNftItem<Swap>).surcharge,
      })
    },
  },
  [TradeType.OFFER]: {
    owner: ({ offered }) => {
      transaction({
        interaction: ShoppingActions.CANCEL_OFFER,
        urlPrefix: urlPrefix.value,
        offeredId: offered.sn,
      })
    },
    incoming: ({ offered, desired, trade }) => {
      transaction({
        interaction: ShoppingActions.ACCEPT_OFFER,
        urlPrefix: urlPrefix.value,
        offeredId: offered.sn,
        nftId: desired.sn,
        collectionId: desired.collection.id,
        price: trade.price,
      })
    },
  },
}

const nftId = computed(() => props.trade?.desired.id)
const offeredItemId = computed(() => props.trade?.offered.id)
const offeredItemSn = computed(() => props.trade?.offered.sn)

const details = computed<Details & OverviewModeDetails>(() =>
  props.trade
    ? {
        ...TradeTypeDetails[props.trade.type],
        ...TradeTypeOverviewModeDetails[props.trade.type][mode.value],
      }
    : {
        title: '',
        signingTitle: '',
        notificationTitle: '',
        transactionSuccessTitle: '',
        transactionSuccessTab: '',
      })

const { data: nft, pending: nftLoading } = await useAsyncData<TradeNFTs | null>(`tarde-nft-id-${nftId.value}`, async () => {
  if (!nftId.value) {
    return null
  }

  const [desired, offered] = await Promise.all([
    useAsyncQuery<{ nftEntity: NFT }>({
      query: nftById,
      variables: {
        id: nftId.value,
      },
      clientId: client.value,
    }),
    useAsyncQuery<{ nftEntity: NFT }>({
      query: nftById,
      variables: {
        id: offeredItemId.value,
      },
      clientId: client.value,
    }),
  ])

  return {
    desired: desired.data.value.nftEntity,
    offered: offered.data.value.nftEntity,
  }
}, { watch: [nftId, offeredItemId] })

const loading = computed(() => nftLoading.value || !nft.value)

const onClose = () => {
  vModel.value = false
  onModalAnimation(() => emit('close'))
}

const execTransaction = () => {
  if (!offeredItemSn.value || !nft.value || !props.trade) {
    return
  }

  vModel.value = false

  TradeTypeTx[props.trade.type][mode.value]({
    trade: props.trade,
    desired: nft.value.desired,
    offered: nft.value.offered,
  } as ExecTxParams)
}

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
