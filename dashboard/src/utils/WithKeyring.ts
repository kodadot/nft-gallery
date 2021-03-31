import { Component, Vue } from 'vue-property-decorator';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import {
  web3Accounts,
  isWeb3Injected
} from '@polkadot/extension-dapp';

export type KeyringAccount = KeyringPair | InjectedAccountWithMeta;

@Component
export default class WithKeyring extends Vue {
  protected keyringLoaded: boolean = false;
  protected keyringAccounts: KeyringPair[] = [];
  protected importedAccounts: InjectedAccountWithMeta[] = [];
  protected keys: any = '';

  public async mountWasmCrypto(): Promise<void> {
    await cryptoWaitReady();
    // console.log('wasmCrypto loadedX');
    await this.loadKeyring();
    // console.log('keyring initX');
  }

  public async loadKeyring(): Promise<void> {
    this.keyringLoaded = true;
    this.keys = keyring;
    this.mapAccounts();
    await this.extensionAccounts();
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

  public async extensionAccounts() {
    if (!isWeb3Injected) {
      console.warn('Extension not working')
      return;
    }

    this.importedAccounts = await web3Accounts({ ss58Format: this.ss58Format || 42 });
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

  // public passwordRequired(address: string): boolean {
  //   if (this.importedAccounts.some(acc => acc.address === address)) {
  //     return true
  //   }

  //   return isAccountLocked(address)
  // }
}
