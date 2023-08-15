<template>
  <NeoButton
    :variant="variant"
    :no-shadow="noShadow"
    @click.native="toggleWalletConnectModal">
    <slot>
      {{ $t(`${label || 'general.connect'}`) }}
    </slot>
  </NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton, NeoButtonVariant } from '@kodadot1/brick'
import { ConnectWalletModalConfig } from '../common/ConnectWallet/useConnectWallet'

defineProps<{
  label?: string
  variant?: NeoButtonVariant
  noShadow?: boolean
}>()

const { $neoModal } = useNuxtApp()
const instance = getCurrentInstance()

const modal = ref<{ close: () => void; isActive?: boolean } | null>(null)
const isMobile = ref(window.innerWidth < 1024)
const emit = defineEmits(['closeBurgerMenu', 'toggleConnectModal'])

const toggleWalletConnectModal = () => {
  if (isMobile) {
    emit('closeBurgerMenu')
  } else {
    emit('toggleConnectModal')
  }

  if (modal.value?.isActive) {
    $neoModal.closeAll()
    modal.value = null
    return
  }

  modal.value = $neoModal.open({
    parent: instance?.proxy,
    ...ConnectWalletModalConfig,
  })
}
</script>
