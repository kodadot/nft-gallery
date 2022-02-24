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
            @click="setWallet(wallet.source)"
            :key="index"
            size="is-medium"
            icon-right="chevron-right"
            expanded>
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
          <div class="subtitle has-text-centered">You win!</div>
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
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { supportWallets, Wallet } from '@/utils/config/wallets'
import { getWallets } from '@talisman-connect/wallets'

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
    this.$store.dispatch('setAuth', { address: account })
  }

  get account() {
    return this.$store.getters.getAuthAddress
  }

  get wallets() {
    return supportWallets
  }

  protected created() {
    const supportedWallets: any[] = getWallets()
    console.log(supportedWallets)
  }

  protected setWallet(source: string): void {
    this.hasSelectedWalletProvider = true

    if (!(window as any).injectedWeb3[source]) {
      this.hasWalletProviderExtension = false
      this.$buefy.notification.open({
        duration: 5500,
        message: `You need to install the - ${source} - browser extension`,
        type: 'is-info',
        hasIcon: true,
      })
      const selectedWallet = supportWallets.find(
        (w: Wallet) => w.source === source
      )
      if (selectedWallet) {
        this.guideUrl = selectedWallet.guideUrl
        this.extensionUrl = selectedWallet.walletUrl
      }
    } else {
      // web3 wallet connect logic here & show accountSelect
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
