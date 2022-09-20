<template>
  <div>
    <div class="modal-card wallet">
      <header class="modal-card-head">
        <b-button
          v-show="hasSelectedWalletProvider"
          type="is-text"
          class="mr-2"
          icon-left="chevron-left"
          @click="hasSelectedWalletProvider = !hasSelectedWalletProvider" />
        <p class="modal-card-title has-text-weight-bold">
          {{ $t('walletConnect.walletHeading') }}
        </p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section v-if="!hasUserWalletAuth" class="modal-card-body py-6">
        <div class="mb-5">
          {{ $t('walletConnect.authText') }}
        </div>
        <b-field>
          <b-checkbox v-model="hasUserAuthorized" @input="setUserAuthValue">
            {{ $t('walletConnect.understand') }}
          </b-checkbox>
        </b-field>
      </section>
      <section v-if="hasUserWalletAuth" class="modal-card-body">
        <div class="has-text-centered">
          <img
            src="~/assets/Koda_Beta.svg"
            alt="First NFT market explorer on Kusama and Polkadot"
            height="32" />
        </div>

        <div v-show="!hasSelectedWalletProvider" class="buttons my-5">
          <b-button
            v-for="(wallet, index) in wallets"
            :key="index"
            size="is-medium"
            icon-right="chevron-right"
            expanded
            @click="setWallet(wallet)">
            <b-image
              :src="wallet.img"
              class="is-24x24"
              style="display: inline-block; vertical-align: middle"></b-image>
            {{ wallet.name }}
          </b-button>
        </div>

        <div
          v-show="hasSelectedWalletProvider && !hasWalletProviderExtension"
          class="buttons my-5">
          <b-button
            tag="a"
            :href="guideUrl"
            target="_blank"
            rel="noopener noreferrer"
            size="is-medium"
            type="is-info"
            expanded>
            {{ $t('walletConnect.learnText') }}
          </b-button>
          <b-button
            tag="a"
            :href="extensionUrl"
            type="is-primary"
            inverted
            outlined
            size="is-medium"
            expanded>
            {{ $t('walletConnect.downloadExtension') }}
          </b-button>
        </div>

        <div v-if="hasSelectedWalletProvider && hasWalletProviderExtension">
          <div class="subtitle is-size-6 has-text-centered is-lowercase">
            {{ $t('general.chooseWallet') }}
            <b-image
              :src="selectedWalletProvider.img"
              class="is-16x16"
              style="display: inline-block; vertical-align: middle" />
            <b>{{ selectedWalletProvider.extensionName }}</b>
            {{ $t('account') }}
          </div>

          <b-field v-if="walletAccounts.length" :label="$t('account')">
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
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { SupportedWallets, WalletAccount } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { web3Accounts } from '@polkadot/extension-dapp'
import { enableExtension, isMobileDevice } from '@/utils/extension'
import shouldUpdate from '@/utils/shouldUpdate'
import correctFormat from '@/utils/ss58Format'
import { formatAddress } from '@/utils/account'
import UseApiMixin from '~/utils/mixins/useApiMixin'
import { onApiConnect } from '@kodadot1/sub-api'
import ChainMixin from '~/utils/mixins/chainMixin'

@Component({})
export default class WalletModal extends mixins(UseApiMixin, ChainMixin) {
  @Prop() public templateValue!: undefined
  protected selectedWalletProvider!: BaseDotsamaWallet
  protected hasSelectedWalletProvider = false
  protected hasWalletProviderExtension = false
  protected guideUrl = ''
  protected extensionUrl = ''
  protected walletAccounts: WalletAccount[] = []
  private hasUserAuthorized = false

  set account(account: string) {
    this.$emit('close')
    this.$store.dispatch('setAuth', { address: account })
    localStorage.setItem('kodaauth', account)
    localStorage.setItem('wallet', this.selectedWalletProvider.extensionName)
  }

  get account() {
    return this.$store.getters.getAuthAddress
  }

  get wallets() {
    return SupportedWallets()
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  get hasUserWalletAuth() {
    return (
      localStorage.getItem('user_auth_wallet_add') || this.hasUserAuthorized
    )
  }

  @Watch('walletAccounts', { immediate: true })
  handleAccounts(value: WalletAccount[], oldVal: WalletAccount[]): void {
    if (shouldUpdate(value, oldVal)) {
      this.walletAccounts = value
    }
  }

  protected formatAccount(account: WalletAccount): WalletAccount {
    return {
      ...account,
      address: formatAddress(account.address, this.ss58Format),
    }
  }

  protected setUserAuthValue() {
    localStorage.setItem(
      'user_auth_wallet_add',
      (!!this.hasUserAuthorized).toString()
    )
  }

  protected setWallet(wallet: BaseDotsamaWallet): void {
    this.selectedWalletProvider = wallet
    this.hasSelectedWalletProvider = true
    this.walletAccounts = []

    // TODO: remove this once the extension is ready
    if (isMobileDevice) {
      onApiConnect(this.apiUrl, async () => {
        await enableExtension()
        this.hasWalletProviderExtension = true
        this.walletAccounts = (await web3Accounts({
          ss58Format: correctFormat(this.ss58Format),
        })) as any[]
        return
      })
    }

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
    } else {
      // web3 wallet connect logic here & show accountSelect, async or not?
      // wallet.enable()

      // init account
      wallet
        .getAccounts()
        .then((data) => {
          this.walletAccounts = data ? data.map(this.formatAccount) : []
        })
        .catch((e) => {
          this.$consola.error('init account error', e)
        })

      // subscribe change
      wallet.subscribeAccounts((accounts) => {
        // list of supported accounts for this wallet to show in AccoutSelect
        if (accounts) {
          this.walletAccounts = accounts.map(this.formatAccount)
        }
      })
      this.hasWalletProviderExtension = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.wallet {
  max-width: 400px;
  border: 3px solid $primary;
  border-radius: 4px;

  &.modal-card {
    background: #1f1f1f;
    backdrop-filter: $frosted-glass-light-backdrop-filter;
  }

  .modal-card-body,
  .modal-card-head {
    background: unset;
    border-bottom: 0;
  }

  .modal-card-body {
    display: block;
  }

  .buttons button {
    border: 0;
    border-radius: 4px;
    justify-content: space-between;
    background-color: #464646;
    font-weight: 600;
  }
}
</style>
