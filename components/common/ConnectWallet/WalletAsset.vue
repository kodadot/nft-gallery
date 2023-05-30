<template>
  <div class="is-flex is-flex-direction-column wallet-asset">
    <WalletAssetSetIdentity v-if="!display" />

    <div class="is-flex is-flex-direction-column wallet-asset-container mt-4">
      <WalletAssetIdentity v-if="redesign" />
      <div v-else>
        <div>
          {{ walletName }}
        </div>
        <Identity
          class="identity-address is-size-6"
          :shortened-address="shortenedAddress"
          :address="account"
          show-clipboard />
      </div>

      <WalletAssetNfts v-if="redesign" />

      <hr class="my-4" />

      <div>
        <ProfileAssetsList v-if="isSnek" @totalValueChange="setTotalValue" />
        <MultipleBalances v-else />

        <WalletAssetPortfolio v-if="redesign" />
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

    <WalletAssetMenu v-if="redesign" />
    <div
      v-else
      class="buttons is-justify-content-space-between is-flex-wrap-nowrap my-2 wallet-asset-container">
      <NeoButton
        class="button is-size-7 is-capitalized is-flex-grow-1"
        :label="$i18n.t('general.change_account')"
        variant="connect-dropdown"
        @click.native="backToWallet" />
      <NeoButton
        class="button is-size-7 is-capitalized is-flex-grow-1"
        :label="$i18n.t('profileMenu.disconnect')"
        variant="connect-dropdown"
        @click.native="disconnect()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { useWalletStore } from '@/stores/wallet'
import { useIdentityStore } from '@/stores/identity'
import { clearSession } from '@/utils/cachingStrategy'
import useIdentity from '@/components/identity/utils/useIdentity'
import WalletAssetIdentity from './WalletAssetIdentity.vue'
import WalletAssetNfts from './WalletAssetNfts.vue'
import WalletAssetPortfolio from './WalletAssetPortfolio.vue'
import WalletAssetMenu from './WalletAssetMenu.vue'
import WalletAssetSetIdentity from './WalletAssetSetIdentity.vue'

const Identity = defineAsyncComponent(
  () => import('@/components/identity/module/IdentityLink.vue')
)
const MultipleBalances = defineAsyncComponent(
  () => import('@/components/balance/MultipleBalances.vue')
)
const ProfileAssetsList = defineAsyncComponent(
  () => import('@/components/rmrk/Profile/ProfileAssetsList.vue')
)

const { redesign } = useExperiments()

const totalValue = ref(0)
const walletStore = useWalletStore()
const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const { $consola } = useNuxtApp()

const emit = defineEmits(['back'])

const account = computed(() => identityStore.getAuthAddress)
const walletName = computed(() => walletStore.getWalletName)
const isSnek = computed(() => urlPrefix.value === 'snek')

const { shortenedAddress, display } = useIdentity({
  address: account.value,
})

const disconnect = () => {
  identityStore.resetAuth()
  clearSession()
}

const backToWallet = () => {
  emit('back')
}

const setTotalValue = (value: number) => {
  totalValue.value = value
}

onMounted(async () => {
  if (identityStore.getAuthAddress) {
    $consola.log('fetching balance...')
    await identityStore.fetchBalance({
      address: identityStore.getAuthAddress,
    })
  }
})

watch(urlPrefix, () => {
  setTotalValue(0)
})
</script>
