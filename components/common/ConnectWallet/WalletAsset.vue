<template>
  <div class="is-flex is-flex-direction-column wallet-asset">
    <WalletAssetSetIdentity v-if="!display" />

    <div class="is-flex is-flex-direction-column wallet-asset-container mt-4">
      <WalletAssetIdentity />
      <WalletAssetNfts />

      <hr class="my-4" />

      <div>
        <MultipleBalances />
        <WalletAssetPortfolio />
      </div>

      <div v-if="isSnek">
        <hr class="my-4" />
        <div
          v-if="totalValue"
          class="is-flex is-justify-content-space-between is-align-items-center my-1">
          <span class="is-size-7"> {{ $i18n.t('spotlight.total') }}: </span>
          <span> ${{ totalValue.toFixed(2) }} </span>
        </div>
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
  () => import('@/components/balance/MultipleBalances.vue')
)

const totalValue = ref(0)
const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const { $consola } = useNuxtApp()

const account = computed(() => identityStore.getAuthAddress)
const isSnek = computed(() => urlPrefix.value === 'snek')

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
