<template>
  <div class="flex flex-col wallet-asset">
    <div class="flex flex-col wallet-asset-container my-4">
      <WalletAssetIdentity />
      <WalletAssetNfts />
      <hr class="my-4">
      <MultipleBalances />
    </div>

    <WalletAssetMenu />
  </div>
</template>

<script lang="ts" setup>
import WalletAssetIdentity from './WalletAssetIdentity.vue'
import WalletAssetNfts from './WalletAssetNfts.vue'
import WalletAssetMenu from './WalletAssetMenu.vue'
import { useIdentityStore } from '@/stores/identity'

const MultipleBalances = defineAsyncComponent(
  () => import('@/components/balance/MultipleBalances.vue'),
)

const identityStore = useIdentityStore()
const { $consola } = useNuxtApp()

onMounted(async () => {
  if (identityStore.getAuthAddress) {
    $consola.log('fetching balance...')
    await identityStore.fetchBalance({
      address: identityStore.getAuthAddress,
    })
  }
})
</script>
