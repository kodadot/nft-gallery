<template>
  <div>
    <SigningModal
      v-if="!autoTeleport"
      ref="signingModal"
      :title="$t('transaction.offer')"
      :is-loading="isLoading"
      :status="status"
      close-at-signed
      @try-again="submitOffer"
    />

    <NeoModal
      :value="preferencesStore.makeOfferModalOpen"
      append-to-body
      @close="onClose"
    >
      <ModalBody
        modal-max-height="100vh"
        :title="$t('transaction.offer')"
        content-class="pt-4 pb-5 px-0"
        :scrollable="false"
        :loading="!autoTeleportLoaded"
        @close="onClose"
      >
        <div class="px-6 max-h-[50vh] overflow-y-auto">
          <ModalIdentityItem />

          <MakeOfferSingleItem v-if="offerStore.items.length === 1" />
        </div>

        <div class="border-t pt-5 pb-4 px-6">
          <div
            class="flex justify-between text-k-grey border-b-k-shade"
          >
            <span>{{ $t('offer.offerFees') }}</span>
            <span class="ml-2">{{ teleportTransitionTxFees }}</span>
          </div>
        </div>

        <div class="flex justify-between px-6">
          <AutoTeleportActionButton
            ref="autoTeleportButton"
            :actions="actions"
            :amount="totalNeededAmount"
            :disabled="confirmButtonDisabled"
            :fees="{ forceActionAutoFees: true }"
            :label="confirmListingLabel"
            early-success
            auto-close-modal
            button-variant="k-blue"
            :auto-close-modal-delay-modal="0"
            @confirm="confirm"
          />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import { shuffle } from 'lodash'
import type { MakingOfferItem } from '@/components/trade/types'
import MakeOfferSingleItem from '@/components/trade/makeOffer/MakeOfferSingleItem.vue'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { usePreferencesStore } from '@/stores/preferences'
import type { ActionOffer, TokenToOffer } from '@/composables/transaction/types'
import { useMakingOfferStore } from '@/stores/makeOffer'
import format, { calculateBalance } from '@/utils/format/balance'
import { warningMessage } from '@/utils/notification'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import AutoTeleportActionButton, {
  type AutoTeleportActionButtonConfirmEvent,
} from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { hasOperationsDisabled } from '@/utils/prefix'
import { offerVisible } from '@/utils/config/permission.config'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'
import { sum } from '@/utils/math'
import { OFFER_MINT_PRICE, getOfferCollectionId } from '@/composables/transaction/transactionOffer'

const DEFAULT_OFFER_EXPIRATION_DURATION = 7

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const offerStore = useMakingOfferStore()
const { accountId } = useAuth()
const {
  transaction,
  isLoading,
  status,
  isError,
  blockNumber,
  clear: clearTransaction,
} = useTransaction({
  disableSuccessNotification: true,
})
const { notification, lastSessionId, updateSession } = useLoadingNotfication()
const { itemsInChain, hasInvalidOfferPrices, count } = storeToRefs(offerStore)

const { decimals, chainSymbol } = useChain()
const { $i18n } = useNuxtApp()

const signingModal = ref()
const items = ref<MakingOfferItem[]>([])
const unusedOfferedItemsSubscription = ref(() => {})
const usedOfferedItems = ref<string[]>([])
const offeredItem = ref<string>()

const getAction = (items: MakingOfferItem[]): ActionOffer => {
  return {
    interaction: ShoppingActions.MAKE_OFFER,
    urlPrefix: urlPrefix.value,
    tokens: items.map(item => ({
      price: item.offerPrice ? String(Number(calculateBalance(Number(item.offerPrice), decimals.value))) : '',
      desiredItem: item.sn,
      desiredCollectionId: item.collection.id,
      offeredItem: offeredItem.value,
      duration: item.offerExpiration || DEFAULT_OFFER_EXPIRATION_DURATION,
    } as TokenToOffer)),
  }
}

const teleportTransitionTxFees = computed(() =>
  format(
    (autoTeleportButton.value?.optimalTransition.txFees || 0) + OFFER_MINT_PRICE,
    decimals.value,
    chainSymbol.value,
  ),
)

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded } = useAutoTeleportActionButton<ActionOffer>({
  getActionFn: () => getAction(itemsInChain.value),
  signingModal,
})

const totalOfferAmount = computed(
  () => calculateBalance(sum(itemsInChain.value.map(nft => Number(nft.offerPrice))), decimals.value),
)

const totalNeededAmount = computed(() => totalOfferAmount.value + (!offeredItem.value ? OFFER_MINT_PRICE : 0))

const actions = computed<AutoTeleportAction[]>(() => [
  {
    action: action.value,
    transaction,
    details: {
      isLoading: isLoading.value,
      status: status.value,
      isError: isError.value,
      blockNumber: blockNumber.value,
    },
  },
])

const confirmButtonDisabled = computed(
  () =>
    hasOperationsDisabled(urlPrefix.value)
    || hasInvalidOfferPrices.value
    || !autoTeleportButton.value?.isReady,
)

const confirmListingLabel = computed(() => {
  if (!offerVisible(urlPrefix.value)) {
    return $i18n.t('toast.unsupportedOperation')
  }

  if (!totalOfferAmount.value) {
    return $i18n.t('offer.emptyInput')
  }

  if (hasInvalidOfferPrices.value) {
    return $i18n.t('offer.invalidPrice')
  }

  if (!autoTeleportButton.value?.isReady) {
    return $i18n.t('autoTeleport.checking')
  }
  return $i18n.t('transaction.offer')
})

const submitOffer = () => {
  return transaction(getAction(items.value))
}

async function confirm({ autoteleport }: AutoTeleportActionButtonConfirmEvent) {
  try {
    clearTransaction()
    unusedOfferedItemsSubscription.value()

    autoTeleport.value = autoteleport
    items.value = [...itemsInChain.value]

    if (!autoteleport) {
      await submitOffer()
    }

    offerStore.clear()
    closeMakingOfferModal()
  }
  catch (error) {
    warningMessage(error)
  }
}

const onClose = () => {
  closeMakingOfferModal()
}
const closeMakingOfferModal = () => (preferencesStore.makeOfferModalOpen = false)

watch(
  () => count.value,
  () => {
    if (count.value === 0) {
      closeMakingOfferModal()
    }
  },
)

useModalIsOpenTracker({
  isOpen: computed(() => preferencesStore.makeOfferModalOpen),
  onChange: () => {
    offerStore.clear()
    unusedOfferedItemsSubscription.value()
  },
})

useModalIsOpenTracker({
  isOpen: computed(() => preferencesStore.makeOfferModalOpen),
  onClose: false,
  onChange: () => {
    unusedOfferedItemsSubscription.value = useSubscriptionGraphql({
      query: `
      offers(where: {
        status_not_in: [ACTIVE, ACCEPTED]
        caller_eq: "${accountId.value}"
        nft: {
          currentOwner_eq: "${accountId.value}"
          collection: {
            id_eq: "${getOfferCollectionId(urlPrefix.value)}"
          }
        }
      }) {
        nft {
          sn
        }
      }`,
      onChange: ({ data: { offers: items } }) => {
        const tokensSn = items
          .map(({ nft }) => nft.sn)
          .filter((tokenSn: string) => !usedOfferedItems.value.includes(tokenSn))

        const unusedOfferedItems = shuffle(tokensSn)

        offeredItem.value = unusedOfferedItems[0]
      },
    })
  },
})

useTransactionTracker({
  transaction: {
    isError,
    status,
  },
  onSuccess: () => {
    if (offeredItem.value) {
      usedOfferedItems.value.push(offeredItem.value)
      offeredItem.value = undefined
    }
  },
})

useTransactionNotification({
  status,
  isError,
  sessionId: lastSessionId,
  autoTeleport,
  updateSession,
  onSuccess: () => preferencesStore.setTriggerOfferSuccess(true),
  init: () => {
    return notification(({ isSessionState, notify, session }) => {
      return notify({
        title: ref($i18n.t('offer.offerCreation')),
        state: computed(() => session?.value.state as LoadingNotificationState),
        action: computed<NotificationAction | undefined>(() => {
          if (isSessionState('succeeded')) {
            return {
              label: $i18n.t('offer.manageOffers'),
              icon: 'arrow-up-right',
              url: `/${urlPrefix.value}/u/${accountId.value}?tab=offers&filter=outgoing`,
            }
          }

          return undefined
        }),
        showIndexerDelayMessage: true,
      })
    })
  },
})

onBeforeMount(closeMakingOfferModal)
onUnmounted(closeMakingOfferModal)
</script>

<style lang="scss" scoped>
:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
