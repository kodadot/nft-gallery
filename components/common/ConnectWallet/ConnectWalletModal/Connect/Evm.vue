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

const { openModal, account } = useWeb3Modal()
const walletStore = useWalletStore()

watch(account, (account) => {
  if (account.address) {
    walletStore.setWallet({
      address: account.address as string,
      vm: 'EVM',
      name: 'test',
      extension: 'web3modal',
    })
  }
})
</script>
