<template>
  <div class="!mt-6 h-full">
    <NeoButton
      variant="k-accent"
      no-shadow
      :loading="isConnecting"
      :disabled="isConnecting"
      loading-with-label
      size="large"
      class="w-full"
      @click="modal?.open()">
      <div class="inline-flex gap-3">
        <span>
          {{ isConnecting ? 'Connecting' : 'Connect with Web3Modal' }}
        </span>
        <NeoIcon icon="arrow-right" />
      </div>
    </NeoButton>
  </div>
</template>
<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const emits = defineEmits(['select'])

const walletStore = useWalletStore()
const { address, isConnected, isConnecting } = useWagmi()
const { modal } = useWeb3Modal()

watch([address, isConnected], ([address, isConnected]) => {
  if (address && isConnected) {
    walletStore.setWallet({
      address: address as string,
      vm: 'EVM',
    })
    emits('select', { address })
  }
})
</script>
