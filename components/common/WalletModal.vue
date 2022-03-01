<template>
  <div>
    <div class="modal-card wallet">
      <header class="modal-card-head">
        <b-button
          type="is-text"
          class="mr-2"
          icon-left="chevron-left"
          @click="hasSelectedWalletProvider = !hasSelectedWalletProvider"
          v-show="hasSelectedWalletProvider" />
        <p class="modal-card-title">Connect Wallet</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <div class="has-text-centered">
          <img
            src="~/assets/Koda_Beta.svg"
            alt="First NFT market explorer on Kusama and Polkadot"
            height="32" />
        </div>

        <div class="buttons my-5" v-show="!hasSelectedWalletProvider">
          <b-button
            v-for="(wallet, index) in wallets"
            @click="setWallet(wallet)"
            :key="index"
            size="is-medium"
            icon-right="chevron-right"
            expanded>
            <b-image
              :src="wallet.img"
              class="is-24x24"
              style="display: inline-block; vertical-align: middle"></b-image>
            {{ wallet.name }}
          </b-button>
        </div>

        <div
          class="buttons my-5"
          v-show="hasSelectedWalletProvider && !hasWalletProviderExtension">
          <b-button
            tag="a"
            :href="guideUrl"
            target="_blank"
            size="is-medium"
            type="is-info"
            expanded>
            Lean how to Connect
          </b-button>
          <b-button
            tag="a"
            :href="extensionUrl"
            type="is-primary"
            inverted
            outlined
            size="is-medium"
            expanded>
            Download extension
          </b-button>
        </div>

        <div v-if="hasSelectedWalletProvider && hasWalletProviderExtension">
          <div class="subtitle has-text-centered">Choose your account</div>
          <AccountSelect
            v-model="account"
            :label="$i18n.t('Account')"
            :tooltip-visible="false" />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { SupportedWallets, Wallet } from '@/utils/config/wallets'
import { InjectedWindow } from '@polkadot/extension-inject/types'

@Component({
  components: {
    AccountSelect: () => import('@/components/shared/AccountSelect.vue'),
  },
})
export default class extends Vue {
  @Prop() public templateValue!: undefined
  protected hasSelectedWalletProvider = false
  protected hasWalletProviderExtension = false
  protected guideUrl = ''
  protected extensionUrl = ''

  set account(account: string) {
    this.$emit('close')
    this.$store.dispatch('setAuth', { address: account })
  }

  get account() {
    return this.$store.getters.getAuthAddress
  }

  get wallets() {
    return SupportedWallets
  }

  protected setWallet(wallet: Wallet): void {
    this.hasSelectedWalletProvider = true
    const injectedWindow = window as Window & InjectedWindow
    console.log(injectedWindow?.injectedWeb3)

    if (!wallet.installed) {
      this.hasWalletProviderExtension = false
      this.guideUrl = wallet.guideUrl
      this.extensionUrl = wallet.walletUrl
      this.$buefy.notification.open({
        duration: 5500,
        message: `You need to install the - ${wallet.source} - browser extension`,
        type: 'is-info',
        hasIcon: true,
      })
      console.log('you need to install wallet')
    } else {
      // web3 wallet connect logic here & show accountSelect, async or not?
      // async () => {
      wallet.enable()
      wallet.subscribeAccounts((accounts) => {
        console.log(accounts)
      })
      // }
      this.hasWalletProviderExtension = true
    }
  }
}
</script>

<style lang="scss" scoped>
.wallet {
  border-radius: 10px;
  max-width: 400px;

  .modal-card-head {
    background-color: rgb(44, 45, 48) !important;
    border-bottom: inherit;
  }

  .modal-card-body {
    background-color: rgb(44, 45, 48) !important;
  }

  .buttons button {
    border-radius: 6px;
    background-color: #404144;
    justify-content: space-between;
  }
}
</style>
