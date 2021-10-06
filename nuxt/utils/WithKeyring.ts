import { Component, Vue, Watch } from 'vue-property-decorator';
import keyring, { Keyring } from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { enableExtension } from '@/extension';
import correctFormat from '@/utils/ss58Format'

import {
  web3Accounts,
  isWeb3Injected
} from '@polkadot/extension-dapp';
import { getPrefixByStoreUrl } from '@/utils/chain'

export type KeyringAccount = KeyringPair | InjectedAccountWithMeta;

@Component
export default class WithKeyring extends Vue {
  protected keyringLoaded: boolean = false;
  protected keyringAccounts: KeyringPair[] = [];
  protected importedAccounts: InjectedAccountWithMeta[] = [];
  // protected keys: any = '';

  public async mountWasmCrypto(): Promise<void> {
    await cryptoWaitReady();
    // console.log('wasmCrypto loadedX');
    await this.loadKeyring();
    // console.log('keyring initX');
  }

  public async loadKeyring(ss58?: number): Promise<void> {
    this.keyringLoaded = true;
    // this.keys = keyring;
    this.mapAccounts();
    await this.extensionAccounts(ss58);
  }

  public mapAccounts(): void {
    this.keyringAccounts = keyring.getPairs();
  }

  get chainProperties() {
    return this.$store.getters.getChainProperties;
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  public async extensionAccounts(ss58?: number) {
    if (!isWeb3Injected) {
      console.warn('Extension not working, reload might fix things')
      await enableExtension();
    }

    const ss58Changed = typeof ss58 === 'number'
    const ss58Forever = ss58Changed ? ss58 : this.ss58Format

    this.importedAccounts = await web3Accounts({ ss58Format: correctFormat(ss58Forever) >= 0 ? correctFormat(ss58Forever) : correctFormat(this.prefixByStore)  });

    // if ((!this.accountId || ss58Changed) && this.importedAccounts?.length && process.env.VUE_APP_KEYRING) {
    //   this.$store.dispatch('setAuth', { address: this.importedAccounts[0]?.address });
    // }
  }

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  get getSettings() {
    return this.$store.getters.getSettings?.apiUrl;
  }

  get prefixByStore() {
    return correctFormat(getPrefixByStoreUrl(this.getSettings()))
  }

  public allAcctounts(): KeyringAccount[] {
    return [...this.keyringAccounts, ...this.importedAccounts]
  }

  public created(): void {
    this.mountWasmCrypto();
  }

  public getPair(address: string): KeyringPair {
    return keyring.getPair(address);
  }

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }

  @Watch('ss58Format')
  handleChange(val: string) {
    console.log('ss58Format', val)
    // https://github.com/polkadot-js/ui/pull/494
    keyring.setSS58Format(Number(val))
    this.loadKeyring(Number(val));
  }

  // public passwordRequired(address: string): boolean {
  //   if (this.importedAccounts.some(acc => acc.address === address)) {
  //     return true
  //   }

  //   return isAccountLocked(address)
  // }
}
