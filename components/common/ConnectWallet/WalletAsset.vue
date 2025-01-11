<template>
  <div class="flex flex-col wallet-asset">
    <div class="flex flex-col wallet-asset-container my-4">
      <WalletAssetIdentity />
      <WalletAssetNfts />
      <hr class="my-4">
      <MultipleBalances />
    </div>

    <div class="h-full flex flex-col justify-end gap-5">
      <WalletAssetTrades v-if="tradeVisible(urlPrefix) && vm === walletVm" />
      <WalletAssetMenu />
    </div>
  </div>
</template>

<script lang="ts" setup>
import WalletAssetIdentity from './WalletAssetIdentity.vue'
import WalletAssetNfts from './WalletAssetNfts.vue'
import WalletAssetMenu from './WalletAssetMenu.vue'
import WalletAssetTrades from './WalletAssetTrades.vue'
import { useIdentityStore } from '@/stores/identity'
import { tradeVisible } from '@/utils/config/permission.config'

const MultipleBalances = defineAsyncComponent(
  () => import('@/components/balance/MultipleBalances.vue'),
)

const identityStore = useIdentityStore()
const { $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { vm } = useChain()
const { getWalletVM: walletVm } = storeToRefs(useWalletStore())

if (identityStore.getAuthAddress) {
  $consola.log('fetching balance...')
  identityStore.fetchBalance({ address: identityStore.getAuthAddress })
}
</script>
