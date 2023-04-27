<template>
  <div class="wallet-modal-container is-flex is-flex-direction-column">
    <header class="modal-card-head mb-4">
      <b-button
        v-show="hasSelectedWalletProvider"
        type="is-text"
        class="mr-2 is-no-border"
        icon-left="chevron-left"
        @click="hasSelectedWalletProvider = !hasSelectedWalletProvider" />
      <span class="modal-card-title is-size-6 has-text-weight-bold">
        {{ headerTitle }}
      </span>
      <a class="is-flex is-align-items-center" @click="emit('close')">
        <NeoIcon icon="close" />
      </a>
    </header>
    <section v-if="showAccount">
      <WalletAsset @back="setForceWalletSelect" />
    </section>
    <section v-else-if="hasUserWalletAuth" class="modal-card-body">
      <div class="buttons m-0">
        <WalletMenuItem
          v-for="(wallet, index) in installedWallet"
          :key="index"
          :wallet="wallet"
          @setAccount="setAccount" />
      </div>

      <a
        class="is-flex is-align-items-center pt-4 pb-3 is-size-7 has-text-grey more-option-button"
        @click="toggleShowUninstalledWallet">
        {{ $i18n.t('walletConnect.moreOption') }}
        <NeoIcon
          v-if="showUninstalledWallet"
          class="ml-1"
          icon="chevron-down" />

        <NeoIcon v-else class="ml-1" icon="chevron-right" />
      </a>
      <div v-if="showUninstalledWallet" class="buttons">
        <WalletMenuItem
          v-for="wallet in uninstalledWallet"
          :key="wallet.name"
          :wallet="wallet" />
      </div>
    </section>
    <section v-else class="modal-card-body p-4">
      <div class="mb-5">
        {{ $i18n.t('walletConnect.authText') }}
      </div>
      <b-field>
        <NeoButton
          size="medium"
          variant="k-accent"
          class="confirm-button"
          @click.native="setUserAuthValue">
          <span class="is-flex is-align-items-center is-justify-content-center">
            {{ $i18n.t('walletConnect.confirm') }}
            <NeoIcon class="ml-2" icon="chevron-right" />
          </span>
        </NeoButton>
      </b-field>
    </section>

    <footer v-if="!showAccount" class="px-5 py-4">
      <div>{{ $i18n.t('walletConnect.walletQuestion') }}</div>
      <div class="is-size-7">
        {{ $i18n.t('walletConnect.walletAnswer') }}
      </div>
      <a
        class="is-size-7 has-text-link is-flex is-align-items-center"
        href="https://docs.kodadot.xyz/tutorial-overview.html"
        target="_blank"
        rel="noopener noreferrer">
        <NeoIcon class="mr-2" icon="circle-info" />
        {{ $i18n.t('walletConnect.walletLink') }}
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { SupportedWallets } from '@/utils/config/wallets'
import { getRedirectToRmrk2HostnameWhitelist } from '@/utils/config/whitelist'
import { toDefaultAddress } from '@/utils/account'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { Auth, useIdentityStore } from '@/stores/identity'
import WalletMenuItem from '@/components/common/ConnectWallet/WalletMenuItem'
import WalletAsset from '@/components/common/ConnectWallet/WalletAsset'

const { $i18n } = useNuxtApp()
const selectedWalletProvider = ref<BaseDotsamaWallet>()
const hasSelectedWalletProvider = ref(false)
const forceWalletSelect = ref(false)
const identityStore = useIdentityStore()

const setForceWalletSelect = () => {
  forceWalletSelect.value = true
}

const account = computed(() => identityStore.auth.address)
const showAccount = computed(() => account.value && !forceWalletSelect.value)

const wallets = SupportedWallets()
const headerTitle = computed(() =>
  $i18n.t(
    account.value
      ? 'walletConnect.walletDetails'
      : hasUserWalletAuth
      ? 'walletConnect.walletHeading'
      : 'walletConnect.warning'
  )
)
const setAccount = (account: Auth) => {
  forceWalletSelect.value = false
  identityStore.setAuth(account)

  if (selectedWalletProvider.value) {
    localStorage.setItem('wallet', selectedWalletProvider.value.extensionName)
  }
  if (
    getRedirectToRmrk2HostnameWhitelist().includes(
      toDefaultAddress(account.address)
    ) &&
    !location.hostname.startsWith('rmrk2.') &&
    !location.hostname.startsWith('rmrk.')
  ) {
    window.open(`${location.protocol}//rmrk2.${location.host}`, '_self')
  }
}
const setUserAuthValue = () => {
  hasUserWalletAuth.value = true
  localStorage.setItem('user_auth_wallet_add', true.toString())
}
const installedWallet = computed(() => {
  return wallets.filter((wallet) => wallet.installed)
})
const uninstalledWallet = computed(() => {
  return wallets.filter((wallet) => !wallet.installed)
})
const showUninstalledWallet = ref(!installedWallet.value.length)
const hasUserWalletAuth = ref(
  Boolean(localStorage.getItem('user_auth_wallet_add'))
)
const emit = defineEmits(['close'])

const toggleShowUninstalledWallet = () => {
  showUninstalledWallet.value = !showUninstalledWallet.value
}
// watch(account, async (account) => {
//   console.log('WATCH ACCOUNT CHANGE')
//   console.log(account)
//   forceWalletSelect.value = false
//   await identityStore.fetchBalance({ address: account })

// })
</script>
