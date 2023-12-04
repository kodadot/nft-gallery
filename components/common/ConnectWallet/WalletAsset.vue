<template>
  <div class="is-flex is-flex-direction-column wallet-asset">
    <WalletAssetSetIdentity v-if="!display" />

    <div class="is-flex is-flex-direction-column wallet-asset-container mt-4">
      <WalletAssetIdentity />
      <WalletAssetNfts />

      <hr class="my-8" />

      <div>
        <MultipleBalances />
        <WalletAssetPortfolio />
      </div>
    </div>

    <WalletAssetMenu />
  </div>
</template>

<script lang="ts" setup>
import { useIdentityStore } from '@/stores/identity'
import WalletAssetIdentity from './WalletAssetIdentity.vue'
import WalletAssetNfts from './WalletAssetNfts.vue'
import WalletAssetPortfolio from './WalletAssetPortfolio.vue'
import WalletAssetMenu from './WalletAssetMenu.vue'
import WalletAssetSetIdentity from './WalletAssetSetIdentity.vue'

const MultipleBalances = defineAsyncComponent(
  () => import('@/components/balance/MultipleBalances.vue'),
)

const identityStore = useIdentityStore()
const { $consola } = useNuxtApp()

const account = computed(() => identityStore.getAuthAddress)

const { display } = useIdentity({
  address: account,
})

onMounted(async () => {
  if (identityStore.getAuthAddress) {
    $consola.log('fetching balance...')
    await identityStore.fetchBalance({
      address: identityStore.getAuthAddress,
    })
  }
})
</script>
