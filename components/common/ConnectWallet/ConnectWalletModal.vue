<template>
  <div class="wallet-modal-container is-flex is-flex-direction-column">
    <header class="modal-card-head p-4">
      <b-button
        v-show="hasSelectedWalletProvider"
        type="is-text"
        class="mr-2 is-no-border"
        icon-left="chevron-left"
        @click="hasSelectedWalletProvider = !hasSelectedWalletProvider" />
      <span class="modal-card-title is-size-6">
        {{
          $i18n.t(
            hasUserWalletAuth
              ? 'walletConnect.walletHeading'
              : 'walletConnect.warning'
          )
        }}
      </span>
      <button type="button" class="delete p-0" @click="emit('close')"></button>
    </header>
    <section v-if="hasUserWalletAuth" class="modal-card-body">
      <div class="buttons m-0">
        <WalletMenuItem
          v-for="(wallet, index) in installedWallet"
          :key="index"
          :wallet="wallet"
          @setAccount="setAccount" />
      </div>

      <a
        class="is-flex is-align-items-center mx-5 py-2 is-size-7 has-text-grey more-option-button"
        @click="toggleShowUninstalledWallet">
        {{ $i18n.t('walletConnect.moreOption')
        }}<b-icon
          class="ml-1"
          :icon="
            showUninstalledWallet ? 'chevron-down' : 'chevron-right'
          "></b-icon>
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
          :label="`${$i18n.t('walletConnect.confirm')} >`"
          size="medium"
          variant="k-accent"
          class="confirm-button"
          no-shadow
          @click.native="setUserAuthValue" />
      </b-field>
    </section>

    <footer class="px-5 py-4">
      <div>{{ $i18n.t('walletConnect.walletQuestion') }}</div>
      <div class="is-size-7">
        {{ $i18n.t('walletConnect.walletAnswer') }}
      </div>
      <a
        class="is-size-7 has-text-link is-flex is-align-items-center"
        target="_blank">
        <svg
          class="mr-2"
          width="9"
          height="10"
          viewBox="0 0 9 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.5 0.5C2.0187 0.5 0 2.5187 0 5C0 7.4813 2.0187 9.5 4.5 9.5C6.9813 9.5 9 7.4813 9 5C9 2.5187 6.9813 0.5 4.5 0.5ZM4.95 7.25H4.05V4.55H4.95V7.25ZM4.95 3.65H4.05V2.75H4.95V3.65Z"
            fill="#6188E7" />
        </svg>
        {{ $i18n.t('walletConnect.walletLink') }}
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { SupportedWallets, WalletAccount } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import shouldUpdate from '@/utils/shouldUpdate'
import { formatAddress } from '@/utils/account'
import ChainMixin from '~/utils/mixins/chainMixin'
import { NeoButton } from '@kodadot1/brick'
import shortAddress from '@/utils/shortAddress'
import WalletMenuItem from '@/components/common/ConnectWallet/WalletMenuItem'

const { chainProperties } = useChain()
const { $store, $buefy, $consola } = useNuxtApp()
const selectedWalletProvider = ref<BaseDotsamaWallet>()
const hasSelectedWalletProvider = ref(false)
const hasWalletProviderExtension = ref(false)
const showUninstalledWallet = ref(false)
const guideUrl = ref('')
const extensionUrl = ref('')
const walletAccounts = ref<WalletAccount[]>([])
const account = ref<string>($store.getters.getAuthAddress)
const hasUserWalletAuth = ref(
  Boolean(localStorage.getItem('user_auth_wallet_add'))
)
const emit = defineEmits(['close'])

const toggleShowUninstalledWallet = () => {
  showUninstalledWallet.value = !showUninstalledWallet.value
}
watch(account, (account) => {
  const walletName = walletAccounts.value.find(
    (wallet) => wallet.address === account
  )?.name
  emit('close')
  $store.dispatch('wallet/setWalletName', { name: walletName })
  $store.dispatch('setAuth', { address: account })
  localStorage.setItem('kodaauth', account)
  if (selectedWalletProvider.value) {
    localStorage.setItem('wallet', selectedWalletProvider.value.extensionName)
  }
})

const wallets = SupportedWallets()

const setAccount = (addr: string) => {
  account.value = addr
}
const installedWallet = computed(() => {
  return wallets.filter((wallet) => wallet.installed)
})
const uninstalledWallet = computed(() => {
  return wallets.filter((wallet) => !wallet.installed)
})

const setUserAuthValue = () => {
  localStorage.setItem('user_auth_wallet_add', true.toString())
  hasUserWalletAuth.value = true
}
</script>
