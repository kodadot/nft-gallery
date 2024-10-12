<template>
  <div>
    <SigningModal
      v-if="!autoTeleport"
      :title="$t('transaction.transferingNft', items.length)"
      :is-loading="isLoading"
      :status="status"
      close-at-signed
      @try-again="itemTransfer"
    />

    <NeoModal
      :value="isModalActive"
      append-to-body
      @close="onClose"
    >
      <ModalBody
        modal-max-height="100vh"
        :title="$t('transaction.transferNft', items.length)"
        content-class="!py-4 !px-8"
        :scrollable="false"
        :loading="loading"
        @close="onClose"
      >
        <div>
          <ModalIdentityItem />

          <div>
            <ItemTransferSingleItem
              v-if="items.length === 1"
              class="!mt-4"
              :item="nft"
            />
            <ItemTransferMultipleItems
              v-else
              class="!mt-8"
              :items="items"
            />
          </div>

          <hr class="my-4">

          <h2 class="mb-2 font-bold text-text-color capitalize">
            {{ $t('transaction.transferTo') }}
          </h2>

          <AddressInput
            v-model="address"
            :is-invalid="isYourAddress"
            label=""
            class="flex-1"
            placeholder="Enter wallet address"
            with-address-check
            @check="handleAddressCheck"
          />
        </div>

        <div class="pt-12 flex flex-col">
          <div class="flex text-k-grey justify-between items-center mb-4">
            <span class="text-xs capitalize">{{
              $t('transfers.networkFee')
            }}</span>
            <span class="text-xs">{{ formattedTxFees }}</span>
          </div>

          <AutoTeleportActionButton
            ref="autoTeleportButton"
            :actions="actions"
            :disabled="isDisabled"
            :label="transferItemLabel"
            :fees="{ forceActionAutoFees: true }"
            early-success
            auto-close-modal
            :auto-close-modal-delay-modal="0"
            @confirm="handleTransfer"
          />

          <div class="mt-3 flex justify-between text-k-grey">
            <NeoIcon
              icon="circle-info"
              size="small"
              class="mr-4"
            />

            <p class="text-xs">
              {{ $t('transaction.wrongAddressCannotRecoveredWarning') }}
            </p>
          </div>
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoModal } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark/v1'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { toSubstrateAddress } from '@/services/profile'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import AddressInput from '@/components/shared/AddressInput.vue'
import type { Actions } from '@/composables/transaction/types'
import { hasOperationsDisabled } from '@/utils/prefix'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import type { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'

const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { $i18n } = useNuxtApp()
const { transaction, status, isLoading, isError, blockNumber, clear: clearTransaction, txHash } = useTransaction()
const { notification, lastSessionId, updateSession } = useLoadingNotfication()
const { getTransactionUrl } = useExplorer()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const address = ref('')
const isAddressValid = ref(false)
const items = ref<ListCartItem[]>([])

const nft = computed(() => items.value[0])

const abi = useCollectionAbi(computed(() => nft.value?.collection.id))

const getAction = (): Actions => ({
  interaction: Interaction.SEND,
  urlPrefix: urlPrefix.value,
  address: address.value,
  abi: abi.value,
  nfts: items.value.map(item => ({
    id: item.id,
    sn: item.sn,
    collectionId: item.collection.id,
  })),
  successMessage: $i18n.t('transaction.item.success') as string,
  errorMessage: $i18n.t('transaction.item.error') as string,
})

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded, formattedTxFees } = useAutoTeleportActionButton({
  getActionFn: getAction,
})

const actions = computed<AutoTeleportAction[]>(() => isModalActive.value
  ? [
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
    ]
  : [])

const isModalActive = computed(() => preferencesStore.itemTransferCartModalOpen)

const transferItemLabel = computed(() => {
  if (!address.value) {
    return $i18n.t('transaction.inputAddressFirst')
  }
  if (!isAddressValid.value) {
    return $i18n.t('transaction.addressIncorrect')
  }
  if (isYourAddress.value) {
    return $i18n.t('transaction.selfTransfer')
  }
  return $i18n.t('transaction.transferNft')
})

const isYourAddress = computed(
  () => accountId.value === getChainAddress(address.value),
)

const loading = computed(() => (
  !autoTeleportLoaded.value
  || (isEvm(urlPrefix.value) ? !abi.value : false)
))

const isDisabled = computed(
  () =>
    hasOperationsDisabled(urlPrefix.value)
    || !address.value
    || !isAddressValid.value
    || isYourAddress.value,
)

const reset = () => {
  address.value = ''
  isAddressValid.value = false
}

const closeModal = () => {
  preferencesStore.itemTransferCartModalOpen = false
  onModalAnimation(() => {
    listingCartStore.clearListedItems()
    reset()
  })
}

const onClose = () => {
  closeModal()
}

const handleAddressCheck = (isValid: boolean) => {
  isAddressValid.value = isValid
}

const getChainAddress = (value: string) => {
  try {
    return toSubstrateAddress(value)
  }
  catch (error) {
    return null
  }
}

const itemTransfer = async () => {
  try {
    await transaction(action.value)
  }
  catch (error) {
    warningMessage(error)
  }
}

const handleTransfer = async ({ autoteleport }: AutoTeleportActionButtonConfirmEvent) => {
  try {
    clearTransaction()

    autoTeleport.value = autoteleport

    if (!autoteleport) {
      await itemTransfer()
    }

    closeModal()
  }
  catch (error) {
    warningMessage(error)
  }
}

useTransactionNotification({
  status,
  isError,
  sessionId: lastSessionId,
  autoTeleport,
  updateSession,
  init: () => {
    return notification(({ isSessionState, notify, session }) => {
      return notify({
        title: ref($i18n.t('transaction.transferingNft', items.value.length)),
        state: computed(() => session?.value.state as LoadingNotificationState),
        action: computed<NotificationAction | undefined>(() => {
          return isSessionState('succeeded')
            ? ({
                label: $i18n.t('helper.viewTx'),
                icon: 'arrow-up-right',
                url: getTransactionUrl(txHash.value || '', urlPrefix.value) || '',
              })
            : undefined
        }),
        showIndexerDelayMessage: true,
      })
    })
  },
})

useModalIsOpenTracker({
  isOpen: isModalActive,
  onClose: false,
  onChange: () => {
    items.value = [...listingCartStore.itemsInChain]
  },
})

onBeforeMount(closeModal)
</script>
