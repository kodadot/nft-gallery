<template>
  <div>
    <SigningModal
      v-if="!autoTeleport"
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

          <MakingOfferSingleItem v-if="offerStore.items.length === 1" />
        </div>

        <div class="flex justify-between px-6">
          <AutoTeleportActionButton
            ref="autoTeleportButton"
            :actions="actions"
            :amount="totalOfferAmount"
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
import type { MakingOfferItem } from './types'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { usePreferencesStore } from '@/stores/preferences'
import type { Actions, TokenToOffer } from '@/composables/transaction/types'
import { useMakingOfferStore } from '@/stores/makeOffer'
import { calculateBalance } from '@/utils/format/balance'
import { warningMessage } from '@/utils/notification'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import AutoTeleportActionButton, {
  type AutoTeleportActionButtonConfirmEvent,
} from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { hasOperationsDisabled } from '@/utils/prefix'
import MakingOfferSingleItem from '@/components/offer/MakingOfferSingleItem.vue'
import { offerVisible } from '@/utils/config/permission.config'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'
import { sum } from '@/utils/math'
import type { NotificationAction } from '@/utils/notification'

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

const { decimals } = useChain()
const { $i18n } = useNuxtApp()
const items = ref<MakingOfferItem[]>([])

const getAction = (items: MakingOfferItem[]): Actions => {
  return {
    interaction: ShoppingActions.MAKE_OFFER,
    urlPrefix: urlPrefix.value,
    token: items.map(item => ({
      price: String(calculateBalance(Number(item.offerPrice), decimals.value)),
      collectionId: item.collection.id,
      duration: item.offerExpiration || 7,
      nftSn: item.sn,
    } as TokenToOffer)),
  }
}

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded } = useAutoTeleportActionButton({
  getActionFn: () => getAction(itemsInChain.value),
})

const totalOfferAmount = computed(
  () => calculateBalance(sum(itemsInChain.value.map(nft => Number(nft.offerPrice))), decimals.value),
)

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
  },
})

useTransactionNotification({
  status,
  isError,
  sessionId: lastSessionId,
  autoTeleport,
  updateSession,
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
        showIndexerDelayMesasge: true,
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
