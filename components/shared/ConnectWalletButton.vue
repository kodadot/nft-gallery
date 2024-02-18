<template>
  <NeoButton
    :variant="variant"
    :no-shadow="noShadow"
    @click="toggleWalletConnectModal">
    <slot>
      {{ $t(`${label || 'general.connect'}`) }}
    </slot>
  </NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton, NeoButtonVariant } from '@kodadot1/brick'
import { ConnectWalletModalConfig } from '../common/ConnectWallet/useConnectWallet'
import { ModalCloseType } from '../navbar/types'

defineProps<{
  label?: string
  variant?: NeoButtonVariant
  noShadow?: boolean
}>()

const { neoModal } = useProgrammatic()

const modal = ref<{ close: () => void; isActive?: boolean } | null>(null)

const { isMobile, isMobileOrTablet } = useDevice()
const emit = defineEmits(['closeBurgerMenu', 'toggleConnectModal'])

const toggleWalletConnectModal = () => {
  if (isMobileOrTablet) {
    emit('closeBurgerMenu')
  } else {
    emit('toggleConnectModal')
  }

  neoModal.closeAll()

  if (modal.value?.isActive) {
    modal.value = null
    return
  }

  let modalInstance = neoModal.open({
    ...ConnectWalletModalConfig,
    ...(isMobile ? { animation: 'none' } : {}),
    onClose: (type: ModalCloseType) => {
      if (isMobileOrTablet && type === ModalCloseType.BACK) {
        emit('closeBurgerMenu')
      }
    },
  })
  modal.value = modalInstance
}
</script>
