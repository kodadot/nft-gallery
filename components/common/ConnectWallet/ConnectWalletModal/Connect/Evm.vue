<template>
  <NeoButton
    variant="k-accent"
    no-shadow
    size="large"
    class="w-full"
    @click="openModal">
    Connect with Web3Modal
  </NeoButton>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

const emits = defineEmits(['setAccount'])

const { openModal, address } = useWeb3Modal()
const walletStore = useWalletStore()

watch(address, (address) => {
  if (address) {
    walletStore.setWallet({
      address: address as string,
      vm: 'EVM',
    })
    emits('setAccount', { address })
  }
})
</script>
