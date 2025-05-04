<template>
  <div>
    <SigningModal
      v-if="!autoTeleport"
      ref="signingModal"
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
        content-class="!pt-4 !pb-6 !px-8"
        :scrollable="false"
        :loading="loading"
        @close="onClose"
      >
        <div>
          <ModalIdentityItem />

          <slot name="body" />
        </div>

        <div class="flex flex-col">
          <div class="flex  justify-between items-center mb-4">
            <span class="text-xs capitalize text-k-grey">{{
              $t('transfers.networkFee')
            }}</span>

            <div class="flex gap-2 text-xs">
              <span class="text-k-grey">{{ formattedTxFeesUsd }}</span>
              <span>{{ formattedTxFees }}</span>
            </div>
          </div>

          <slot name="action-button-top" />

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
import type { Actions, Abi } from '@/composables/transaction/types'
import { hasOperationsDisabled } from '@/utils/prefix'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import type { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'

const emit = defineEmits(['close', 'open', 'success'])
const props = withDefaults(defineProps<{
  getAction: () => Actions
  label: string
  disabled?: boolean
  loading?: boolean
  title: string
  signingTitle: string
  showTransactionNotification?: boolean
  isModalActive: boolean
  actionDisabled?: boolean
  abi?: Abi | null
}>(), {
  showTransactionNotification: true,
  actionDisabled: false,
  disabled: false,
  loading: false,
})

const signingModal = ref()

const { $i18n } = useNuxtApp()
const { transaction, status, isLoading, isError, blockNumber, clear: clearTransaction, txHash } = useTransaction({ disableSuccessNotification: props.showTransactionNotification })
const { notification, lastSessionId, updateSession } = useLoadingNotfication()
const { getTransactionUrl } = useExplorer()
const { urlPrefix } = usePrefix()
const { isEvm } = useIsChain(urlPrefix)

const isModalActive = computed(() => props.isModalActive)

const actions = ref<AutoTeleportAction[]>([])

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded, formattedTxFees, formattedTxFeesUsd, isActionReady } = useAutoTeleportActionButton({
  getActionFn: props.getAction,
  disabled: computed(() => props.actionDisabled),
  signingModal,
})

const loadingAbi = computed(() => (isEvm.value ? !props.abi : false))
const loading = computed(() => (!autoTeleportLoaded.value || props.loading || loadingAbi.value))
const isDisabled = computed(() => hasOperationsDisabled(urlPrefix.value) || props.disabled)

const closeModal = () => {
  emit('close')
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

if (props.showTransactionNotification) {
  useTransactionNotification({
    status,
    isError,
    sessionId: lastSessionId,
    autoTeleport,
    updateSession,
    onSuccess: async () => {
      emit('success')
      autoTeleport.value = false
    },
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
}

const reset = () => {
  autoTeleport.value = false
}

useModalIsOpenTracker({
  isOpen: isModalActive,
  onClose: false,
  onChange: () => {
    emit('open')
    reset()
  },
})

watchEffect(() => {
  if (autoTeleport.value) {
    return
  }

  actions.value = isModalActive.value && isActionReady.value
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
    : []
})

onBeforeMount(closeModal)
</script>
