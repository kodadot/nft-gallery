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
          <div class="subtitle is-size-6 has-text-centered">
            Choose your
            <b-image
              :src="selectedWalletProvider.img"
              class="is-16x16"
              style="display: inline-block; vertical-align: middle" />
            <b>{{ selectedWalletProvider.extensionName }}</b> account
          </div>

          <b-field :label="$i18n.t('Account')" v-if="walletAccounts.length">
            <b-select v-model="account" placeholder="Select account" expanded>
              <option disabled selected value="">--</option>
              <option
                v-for="option in walletAccounts"
                :key="option.address"
                :value="option.address">
                <b v-if="option.name">{{ option.name }} :</b>
                {{ option.address | shortAddress(10, -10) }}
              </option>
            </b-select>
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { SupportedWallets, Wallet, WalletAccount } from '@/utils/config/wallets'
import shouldUpdate from '@/utils/shouldUpdate'

@Component({
  components: {},
})
export default class WalletModal extends Vue {
  @Prop() public templateValue!: undefined
  protected selectedWalletProvider!: Wallet
  protected hasSelectedWalletProvider = false
  protected hasWalletProviderExtension = false
  protected guideUrl = ''
  protected extensionUrl = ''
  protected walletAccounts: WalletAccount[] = []

  set account(account: string) {
    this.$emit('close')
    this.$store.dispatch('setAuth', { address: account })
    localStorage.setItem('kodaauth', account)
  }

  get account() {
    return this.$store.getters.getAuthAddress
  }

  get wallets() {
    return SupportedWallets
  }

  @Watch('walletAccounts', { immediate: true })
  handleAccounts(value: WalletAccount[], oldVal: WalletAccount[]): void {
    if (shouldUpdate(value, oldVal)) {
      this.walletAccounts = value
    }
  }

  protected setWallet(wallet: Wallet): void {
    this.selectedWalletProvider = wallet
    this.hasSelectedWalletProvider = true
    this.walletAccounts = []

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
        // list of supported accounts for this wallet to show in AccoutSelect
        if (accounts) {
          this.walletAccounts = accounts
        }
      })
      // }
      this.hasWalletProviderExtension = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
.wallet {
  max-width: 400px;
  border: 2px solid $primary;
  &.modal-card {
    background: $frosted-glass-background;
    backdrop-filter: $frosted-glass-light-backdrop-filter;
  }
  .modal-card-body {
    background: unset;
  }

  .modal-card-head {
    background: unset;
  }

  .buttons button {
    border-radius: 0;
    justify-content: space-between;
  }
}
</style>
