<template>
  <div class="modal-card-container">
    <div class="modal-card wallet">
      <header class="modal-card-head pl-2">
        <b-button
          v-show="hasSelectedWalletProvider"
          type="is-text"
          class="mr-2 is-no-border"
          icon-left="chevron-left"
          @click="hasSelectedWalletProvider = !hasSelectedWalletProvider" />
        <p
          class="modal-card-title has-text-weight-bold has-text-centered is-size-6">
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
        <div v-show="!hasSelectedWalletProvider" class="buttons">
          <b-button
            v-for="(wallet, index) in wallets"
            :key="index"
            size="is-medium"
            icon-right="chevron-right"
            expanded
            @click="setWallet(wallet)">
            <span>
              <b-image
                :src="wallet.img"
                class="is-32x32 is-inline-block"
                style="vertical-align: middle"></b-image>
              <span class="is-size-6 ml-2">{{ wallet.name }}</span>
            </span>
          </b-button>
        </div>

        <div
          v-if="hasSelectedWalletProvider && !hasWalletProviderExtension"
          class="buttons">
          <div class="wallet-name is-fullwidth is-size-6 is-lowercase pl-5 p-2">
            <b-image
              :src="selectedWalletProvider.img"
              class="is-32x32 is-inline-block"
              style="vertical-align: middle" />
            <b class="is-white ml-2">{{
              selectedWalletProvider.extensionName
            }}</b>
          </div>
          <b-button
            class="is-size-6 is-height-60"
            tag="a"
            :href="guideUrl"
            target="_blank"
            rel="noopener noreferrer"
            size="is-medium"
            type="is-info"
            expanded>
            {{ $t('walletConnect.learnText') }}
            <b-icon class="ml-1" icon="book-open"></b-icon>
          </b-button>
          <b-button
            class="is-size-6 is-height-60"
            tag="a"
            :href="extensionUrl"
            type="is-info"
            size="is-medium"
            expanded>
            {{ $t('walletConnect.downloadExtension') }}
            <b-icon class="ml-1" icon="download"></b-icon>
          </b-button>
        </div>

        <div v-show="hasSelectedWalletProvider && hasWalletProviderExtension">
          <b-field v-if="walletAccounts.length" style="height: 180px">
            <b-dropdown
              ref="address-chooser"
              v-model="account"
              :mobile-modal="false"
              class="wallet-chooser">
              <template #trigger>
                <div class="wallet-name is-size-6 is-lowercase pl-5 p-2">
                  <b-image
                    :src="selectedWalletProvider.img"
                    class="is-32x32 is-inline-block"
                    style="vertical-align: middle" />
                  <b class="is-white ml-2">{{
                    selectedWalletProvider.extensionName
                  }}</b>
                  <!--                  <b-icon style="color: white" icon="chevron-down"></b-icon>-->
                </div>
              </template>
              <b-dropdown-item
                v-for="option in walletAccounts"
                :key="option.address"
                class="p-2 pl-5 pr-5"
                :value="option.address">
                <span v-if="option.name"
                  >{{ option.name }}
                  <span class="is-pulled-right">{{
                    option.address | shortAddress(6, -3)
                  }}</span>
                </span>
              </b-dropdown-item>
            </b-dropdown>
          </b-field>
        </div>
      </section>
    </div>
    <div class="modal-card-bg" />
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
.modal-card-container {
  font-family: 'Work Sans';
  font-style: normal;
  position: relative;
  border: 1px solid $k-dark;

  .wallet {
    max-width: 280px;
    .wallet-chooser {
      display: block;

      :deep(.dropdown-menu) {
        width: 100%;
        padding-top: 0px;
        display: block !important;
        .dropdown-content {
          box-shadow: none;
          padding-top: 0px;
          border: none;
          a {
            &:hover {
              background-color: $k-accentlight2;
            }
          }
        }
      }
    }

    &.modal-card {
      background: $k-dark;
      backdrop-filter: $frosted-glass-light-backdrop-filter;
      //position: relative;
      z-index: 1;
    }

    .modal-card-body {
      padding: 0;
      background-color: unset;
      &.py-6 {
        padding-left: 1rem;
      }
    }

    .modal-card-head {
      background: unset;
      border-bottom: 1px solid #000000;
      padding: 8px 32px;

      .delete {
        height: 40px;
        width: 40px;
        max-height: 40px;
        max-width: 40px;
      }
    }

    .modal-card-title {
      font-family: 'Work Sans';
      font-style: normal;
    }

    .modal-card-body {
      display: block;
    }

    .buttons {
      margin-bottom: 0;

      button {
        border: 0;
        border-radius: 0;
        justify-content: space-between;
        background-color: $white;
        border-bottom: 1px solid $k-dark;
        margin-bottom: 0;
        height: 60px;
        padding: 8px 32px;

        &:hover {
          background-color: $k-accentlight2;
        }
      }

      a {
        border-bottom: 1px solid #000000;
        margin-bottom: 0;
      }
    }

    .wallet-name {
      background: $k-dark;
    }
  }

  .modal-card-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #000000;
    top: 4px;
    left: 4px;
    z-index: 0;
  }

  .is-fullwidth {
    width: 100%;
  }

  .is-white {
    color: #ffffff;
  }
  .is-height-60 {
    height: 60px;
  }
  .is-no-border {
    border: none;
  }
}
</style>
