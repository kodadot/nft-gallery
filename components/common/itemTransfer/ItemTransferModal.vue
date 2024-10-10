<template>
  <div>
    <SigningModal
      :title="$t('transaction.transferingNft', count)"
      :is-loading="isLoading"
      :status="status"
      @try-again="transfer"
    />

    <NeoModal
      :value="isModalActive"
      append-to-body
      @close="onClose"
    >
      <ModalBody
        modal-max-height="100vh"
        :title="$t('transaction.transferNft', count)"
        content-class="!py-4 !px-8"
        :scrollable="false"
        :loading="!autoTeleportLoaded"
        @close="onClose"
      >
        <div>
          <ModalIdentityItem />

          <div>
            <ItemTransferSingleItem
              v-if="count === 1"
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

        <div class="pt-5 flex flex-col">
          <div class="flex text-k-grey justify-between items-center mb-4">
            <span class="text-xs capitalize">{{
              $t('transfers.networkFee')
            }}</span>
            <span class="text-xs">{{ formattedTxFee }}</span>
          </div>

          <AutoTeleportActionButton
            ref="autoTeleportButton"
            :actions="actions"
            :disabled="isDisabled"
            :label="transferItemLabel"
            early-success
            auto-close-modal
            :auto-close-modal-delay-modal="0"
            @confirm="transfer"
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
import type { Abi, Actions } from '@/composables/transaction/types'
import { hasOperationsDisabled } from '@/utils/prefix'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import type { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'

const props = defineProps<{
  abi?: Abi | null
}>()

const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { itemsInChain: items, count } = storeToRefs(listingCartStore)
const { $i18n } = useNuxtApp()
const { transaction, status, isLoading, isError, blockNumber, clear: clearTransaction } = useTransaction()
const { urlPrefix } = usePrefix()
const { decimals, chainSymbol } = useChain()
const { accountId } = useAuth()

const address = ref('')
const isAddressValid = ref(false)

const nft = computed(() => items.value[0])

const getAction = (): Actions => ({
  interaction: Interaction.SEND,
  urlPrefix: urlPrefix.value,
  address: address.value,
  abi: props.abi,
  nfts: items.value.map(item => ({
    id: item.id,
    sn: item.sn,
    collectionId: item.collection.id,
  })),
  successMessage: $i18n.t('transaction.item.success') as string,
  errorMessage: $i18n.t('transaction.item.error') as string,
})

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded } = useAutoTeleportActionButton({
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

const { txFee } = useTransactionActionFee({ action })

const { formatted: formattedTxFee } = useAmount(
  computed(() => txFee.value),
  decimals,
  chainSymbol,
)

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

const isDisabled = computed(
  () =>
    hasOperationsDisabled(urlPrefix.value)
    || !address.value
    || !isAddressValid.value
    || isYourAddress.value
    || !autoTeleportButton.value?.isReady,
)

const closeModal = (callback?: () => void) => {
  preferencesStore.itemTransferCartModalOpen = false

  if (callback) {
    onModalAnimation(callback)
  }
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

const transfer = async ({ autoteleport }: AutoTeleportActionButtonConfirmEvent) => {
  try {
    clearTransaction()

    autoTeleport.value = autoteleport

    if (!autoteleport) {
      await transaction(action.value)
    }

    closeModal(() => {
      listingCartStore.clearListedItems()
      // resetCartToDefaults()
    })
  }
  catch (error) {
    warningMessage(error)
  }
}

onBeforeMount(closeModal)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.btn-height {
  height: 3.5rem;
}

.limit-width {
  max-width: 100%;
}
</style>
