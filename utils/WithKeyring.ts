import { Component, Watch } from 'nuxt-property-decorator'
import keyring from '@polkadot/ui-keyring'
import { KeyringPair } from '@polkadot/keyring/types'
import { u8aToHex } from '@polkadot/util'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { enableExtension } from '@/utils/extension'
import correctFormat from '@/utils/ss58Format'

import { isWeb3Injected, web3Accounts } from '@polkadot/extension-dapp'
import { getPrefixByStoreUrl } from '@/utils/chain'
import ChainMixin from './mixins/chainMixin'
import { useIdentityStore } from '@/stores/identity'

export type KeyringAccount = KeyringPair | InjectedAccountWithMeta

@Component
export default class WithKeyring extends ChainMixin {
  protected keyringAccounts: KeyringPair[] = []
  protected importedAccounts: InjectedAccountWithMeta[] = []

  public async loadKeyring(ss58?: number): Promise<void> {
    this.mapAccounts()
    await this.extensionAccounts(ss58)
  }

  public mapAccounts(): void {
    this.keyringAccounts = keyring.getPairs()
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  public async extensionAccounts(ss58?: number) {
    if (!isWeb3Injected) {
      console.warn('Extension not working, reload might fix things')
      await enableExtension()
    }

    const ss58Changed = typeof ss58 === 'number'
    const ss58Forever = ss58Changed ? ss58 : this.ss58Format

    this.importedAccounts = await web3Accounts({
      ss58Format:
        correctFormat(ss58Forever) >= 0
          ? correctFormat(ss58Forever)
          : correctFormat(this.prefixByStore),
    })

    // if ((!this.accountId || ss58Changed) && this.importedAccounts?.length && process.env.VUE_APP_KEYRING) {
    //   this.$store.dispatch('setAuth', { address: this.importedAccounts[0]?.address });
    // }
  }

  get identityStore() {
    return useIdentityStore()
  }

  get accountId() {
    return this.identityStore.getAuthAddress
  }

  get getSettings() {
    return this.$store.getters.getSettings?.apiUrl
  }

  get prefixByStore() {
    return correctFormat(getPrefixByStoreUrl(this.getSettings()))
  }

  public allAcctounts(): KeyringAccount[] {
    return [...this.keyringAccounts, ...this.importedAccounts]
  }

  public async created() {
    await this.loadKeyring()
  }

  public getPair(address: string): KeyringPair {
    return keyring.getPair(address)
  }

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey)
  }

  @Watch('ss58Format')
  async handleChange(val: string): Promise<void> {
    console.log('ss58Format', val)
    // https://github.com/polkadot-js/ui/pull/494
    keyring.setSS58Format(Number(val))
    await this.loadKeyring(Number(val))
  }

  // public passwordRequired(address: string): boolean {
  //   if (this.importedAccounts.some(acc => acc.address === address)) {
  //     return true
  //   }

  //   return isAccountLocked(address)
  // }
}
