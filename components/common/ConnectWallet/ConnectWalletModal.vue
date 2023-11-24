<template>
  <div
    class="wallet-modal-container is-flex is-flex-direction-column"
    data-testid="wallet-connect-sidebar-modal">
    <NeoModalHead
      :title="
        showAccount
          ? $i18n.t('profile.page')
          : $i18n.t('walletConnect.walletHeading')
      "
      @close="emit('close', ModalCloseType.BACK)" />
    <section v-if="showAccount">
      <WalletAsset />
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
        class="is-flex is-align-items-center pt-4 pb-3 is-size-7 has-text-grey more-option-button mx-6 my-0"
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
    <section v-else class="modal-card-body px-6 py-4">
      <div class="mb-5">
        {{ $i18n.t('walletConnect.authText') }}
      </div>
      <NeoField>
        <NeoButton
          size="medium"
          variant="k-accent"
          class="confirm-button"
          no-shadow
          @click="setUserAuthValue">
          <span class="is-flex is-align-items-center is-justify-content-center">
            {{ $i18n.t('walletConnect.confirm') }}
            <NeoIcon class="ml-2" icon="chevron-right" />
          </span>
        </NeoButton>
      </NeoField>
    </section>

    <footer v-if="!showAccount" class="px-6 py-4">
      <div>{{ $i18n.t('walletConnect.walletQuestion') }}</div>
      <div class="is-size-7">
        {{ $i18n.t('walletConnect.walletAnswer') }}
      </div>
      <a
        class="is-size-7 has-text-link is-flex is-align-items-center"
        href="https://docs.kodadot.xyz/tutorial-overview.html"
        target="_blank"
        rel="nofollow noopener noreferrer">
        <NeoIcon class="mr-2" icon="circle-info" />
        {{ $i18n.t('walletConnect.walletLink') }}
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { SupportedWallets } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { NeoButton, NeoField, NeoIcon, NeoModalHead } from '@kodadot1/brick'
import { Auth, useIdentityStore } from '@/stores/identity'
import WalletMenuItem from '@/components/common/ConnectWallet/WalletMenuItem.vue'
import WalletAsset from '@/components/common/ConnectWallet/WalletAsset.vue'
import { ModalCloseType } from '@/components/navbar/types'
const { $i18n } = useNuxtApp()
const selectedWalletProvider = ref<BaseDotsamaWallet>()
const forceWalletSelect = ref(false)
const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const emit = defineEmits(['close', 'connect'])

const account = computed(() => identityStore.auth.address)
const showAccount = computed(() => account.value)

const wallets = SupportedWallets()
const setAccount = (account: Auth) => {
  forceWalletSelect.value = false
  identityStore.setAuth(account)
  emit('connect', account)

  if (selectedWalletProvider.value) {
    localStorage.setItem('wallet', selectedWalletProvider.value.extensionName)
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
  Boolean(localStorage.getItem('user_auth_wallet_add')),
)

const toggleShowUninstalledWallet = () => {
  showUninstalledWallet.value = !showUninstalledWallet.value
}

watch(account, (account) => {
  setAccount({ address: account })
})

watch([urlPrefix], () => {
  emit('close', ModalCloseType.NAVIGATION)
})
</script>
