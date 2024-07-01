<template>
  <div class="flex flex-col wallet-asset">
    <div class="flex flex-col wallet-asset-container my-4">
      <WalletAssetIdentity />
      <WalletAssetNfts />

      <template v-if="getIsSubstrate">
        <hr class="my-4" />

        <MultipleBalances />
      </template>
    </div>

    <WalletAssetMenu />
  </div>
</template>

<script lang="ts" setup>
import { useIdentityStore } from '@/stores/identity'
import WalletAssetIdentity from './WalletAssetIdentity.vue'
import WalletAssetNfts from './WalletAssetNfts.vue'
import WalletAssetMenu from './WalletAssetMenu.vue'

const MultipleBalances = defineAsyncComponent(
  () => import('@/components/balance/MultipleBalances.vue'),
)

const identityStore = useIdentityStore()
const { $consola } = useNuxtApp()
const { getIsSubstrate } = storeToRefs(useWalletStore())

onMounted(async () => {
  if (identityStore.getAuthAddress && getIsSubstrate.value) {
    $consola.log('fetching balance...')
    await identityStore.fetchBalance({
      address: identityStore.getAuthAddress,
    })
  }
})
</script>
