<template>
  <div>
    <SigningModal
      v-if="!autoTeleport"
      :title="$t('transaction.offer')"
      :is-loading="isLoading"
      :status="status"
      close-in-block
      @try-again="submitOffer"
    />

    <NeoModal
      :value="isSuccessModalOpen"
      append-to-body
      @close="handleSuccessModalClose"
    >
      <ModalBody
        :title="$t('success')"
        @close="handleSuccessModalClose"
      >
        <SuccessfulMakingOfferBody
          :tx-hash="txHash"
          :items="items"
          :status="status"
        />
      </ModalBody>
    </NeoModal>

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

          <MakingOfferSingleItem />
        </div>

        <div class="flex justify-between px-6">
          <AutoTeleportActionButton
            ref="autoTeleportButton"
            :actions="actions"
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
import SuccessfulMakingOfferBody from '@/components/offer/SuccessfulMakingOfferBody.vue'
import { offerVisible } from '@/utils/config/permission.config'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const offerStore = useMakingOfferStore()
const {
  transaction,
  isLoading,
  status,
  isError,
  blockNumber,
  txHash,
  clear: clearTransaction,
} = useTransaction()

const { isTransactionSuccessful } = useTransactionSuccessful({
  status,
  isError,
})

const { decimals } = useChain()
const { $i18n } = useNuxtApp()
const itemCount = ref(offerStore.count)
const items = ref<MakingOfferItem[]>([])

const isSuccessModalOpen = computed(
  () => Boolean(items.value.length) && isTransactionSuccessful.value,
)

const getAction = (items: MakingOfferItem[]): Actions => {
  return {
    interaction: ShoppingActions.MAKE_OFFER,
    urlPrefix: urlPrefix.value,
    token: items.map(item => ({
      price: String(calculateBalance(Number(item.offerPrice), decimals.value)),
      collectionId: item.collection.id,
      nftSn: item.sn,
    } as TokenToOffer)),
    duration: 300,
    successMessage: $i18n.t('transaction.price.offer') as string,
    errorMessage: $i18n.t('transaction.price.error') as string,
  }
}

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded } = useAutoTeleportActionButton({
  getActionFn: () => getAction(offerStore.itemsInChain),
})

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
    || offerStore.hasInvalidOfferPrices
    || !autoTeleportButton.value?.isReady,
)

const confirmListingLabel = computed(() => {
  if (!offerVisible(urlPrefix.value)) {
    return $i18n.t('toast.unsupportedOperation')
  }

  if (!autoTeleportButton.value?.isReady) {
    return $i18n.t('autoTeleport.checking')
  }
  return $i18n.t('transaction.offer')
})

const submitOffer = () => {
  return transaction(getAction(offerStore.itemsInChain))
}

async function confirm({ autoteleport }: AutoTeleportActionButtonConfirmEvent) {
  try {
    clearTransaction()

    autoTeleport.value = autoteleport
    itemCount.value = offerStore.count
    items.value = [...offerStore.itemsInChain]

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

const handleSuccessModalClose = () => {
  items.value = []
}

watch(
  () => offerStore.count,
  () => {
    if (offerStore.count === 0) {
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

const closeMakingOfferModal = () =>
  (preferencesStore.makeOfferModalOpen = false)

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
