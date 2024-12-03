<template>
  <div>
    <SigningModal
      v-if="!autoTeleport"
      :title="signingTitle"
      :is-loading="isLoading"
      :status="status"
      close-at-signed
      @try-again="execTransaction"
    />

    <NeoModal
      :value="isModalActive"
      append-to-body
      @close="onClose"
    >
      <ModalBody
        modal-max-height="100vh"
        :title="title"
        content-class="!py-4 !px-8"
        :scrollable="false"
        :loading="loading"
        @close="onClose"
      >
        <div>
          <ModalIdentityItem />

          <div>
            <UserCartSingleItem
              v-if="items.length === 1"
              class="!mt-4"
              :item="nft"
            />
            <UserCartMultipleItems
              v-else
              class="!mt-8"
              :items="items"
            />
          </div>

          <slot name="body" />
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
            :fees="{ forceActionAutoFees: true }"
            :actions="actions"
            :disabled="isDisabled"
            :label="label"
            variant="primary"
            no-shadow
            with-shortcut
            early-success
            auto-close-modal
            :auto-close-modal-delay-modal="0"
            @confirm="submit"
          />

          <slot name="footer" />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import type { Actions } from '@/composables/transaction/types'
import { hasOperationsDisabled } from '@/utils/prefix'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import type { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'

const emit = defineEmits(['reset'])
const props = defineProps<{
  getAction: () => Actions
  label: string
  disabled?: boolean
  loading?: boolean
  title: string
  signingTitle: string
}>()

const isModalActive = defineModel({ type: Boolean, required: true })

const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()

const items = ref<ListCartItem[]>([])

const { $i18n } = useNuxtApp()
const { transaction, status, isLoading, isError, blockNumber, clear: clearTransaction, txHash } = useTransaction()
const { notification, lastSessionId, updateSession } = useLoadingNotfication()
const { getTransactionUrl } = useExplorer()
const { urlPrefix } = usePrefix()

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded, formattedTxFees } = useAutoTeleportActionButton({
  getActionFn: props.getAction,
})

const nft = computed(() => items.value[0])
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

const loading = computed(() => (!autoTeleportLoaded.value || props.loading))
const isDisabled = computed(() => hasOperationsDisabled(urlPrefix.value) || props.disabled)

const closeModal = () => {
  preferencesStore.itemTransferCartModalOpen = false
  onModalAnimation(() => {
    listingCartStore.clearListedItems()
    emit('reset')
  })
}

const onClose = () => {
  closeModal()
}

const execTransaction = async () => {
  try {
    await transaction(action.value)
  }
  catch (error) {
    warningMessage(error)
  }
}

const submit = async ({ autoteleport }: AutoTeleportActionButtonConfirmEvent) => {
  try {
    clearTransaction()

    autoTeleport.value = autoteleport

    if (!autoteleport) {
      await execTransaction()
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
        title: ref(props.signingTitle),
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

defineExpose({ items })
</script>
